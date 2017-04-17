var Q = function(selector,scope,options) {
	return Q.select(selector,scope,options);
};

Q.select = function() {  };

Q._normalizeArg = function (arg) {
	if (Q._isString(arg)) {
		arg = arg.replace(/\s+/g, '').split(",");
	}
	if (!Q._isArray(arg)) {
		arg = [arg];
	}
	return arg;
};

Q._extend = function (dest, source) {
	if (!source) {
		return dest;
	}
	for (var prop in source) {
		dest[prop] = source[prop];
	}
	return dest;
};

Q._has = function (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
};

Q._isString = function (obj) {
	return typeof obj === "string";
};

Q._isFunction = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
};

Q._isObject = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

Q._isArray = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

Q._each = function (obj, iterator, context) {
	if (obj == null) {
		return;
	}
	if (obj.forEach) {
		obj.forEach(iterator, context);
	} else if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			iterator.call(context, obj[i], i, obj);
		}
	} else {
		for (var key in obj) {
			iterator.call(context, obj[key], key, obj);
		}
	}
};

Q._keys = Object.keys || function (obj) {
	if (Q._isObject(obj)) {
		throw new TypeError('Invalid object');
	}
	var keys = [];
	for (var key in obj) {
		if (Q._has(obj, key)) {
			keys[keys.length] = key;
		}
	}
	return keys;
};

(function () {
	var initializing = false,
		fnTest = /xyz/.test(function () {
			var xyz;
		}) ? /\b_super\b/ : /.*/;

	Q.Class = function () {};

	Q.Class.prototype.isA = function (className) {
		return this.className === className;
	};

	Q.Class.extend = function (className, prop, classMethods) {
		if (!Q._isString(className)) {
			classMethods = prop;
			prop = className;
			className = null;
		}
		var _super = this.prototype,
			ThisClass = this;

		initializing = true;
		var prototype = new ThisClass();
		initializing = false;

		function _superFactory(name, fn) {
			return function () {
				var tmp = this._super;

				this._super = _super[name];

				var ret = fn.apply(this, arguments);
				this._super = tmp;

				return ret;
			};
		}

		for (var name in prop) {
			prototype[name] = typeof prop[name] === "function" &&
				typeof _super[name] === "function" &&
				fnTest.test(prop[name]) ?
				_superFactory(name, prop[name]) :
				prop[name];
		}

		function Class() {
			if (!initializing && this.init) {
				this.init.apply(this, arguments);
			}
		}

		Class.prototype = prototype;

		Class.prototype.constructor = Class;

		Class.extend = Q.Class.extend;

		if (classMethods) {
			Q._extend(Class, classMethods);
		}

		if (className) {
			Q[className] = Class;
			Class.prototype.className = className;
			Class.className = className;
		}

		return Class;
	};
}());

Q.Class.extend("Evented",{
	on: function(event,target,callback) {
		if (Q._isArray(event) || event.indexOf(",") !== -1) {
			event = Q._normalizeArg(event);
			for (var i = 0; i < event.length; i++) {
				this.on(event[i], target, callback);
			}
			return;
		}

		if (!callback) {
			callback = target;
			target = null;
		}

		if (!callback) {
			callback = event;
		}

		if (Q._isString(callback)) {
			callback = (target || this)[callback];
		}

		this.listeners = this.listeners || {};
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push([target || this, callback]);

		if (target) {
			if (!target.binds) {
				target.binds = [];
			}
			target.binds.push([this, event, callback]);
		}
	},

	trigger: function (event, data) {
		if (this.listeners && this.listeners[event]) {
			for (var i = 0, len = this.listeners[event].length; i < len; i++) {
				var listener = this.listeners[event][i];
				listener[1].call(listener[0], data);
			}
		}
	},

	off: function (event, target, callback) {
		if (!target) {
			if (this.listeners[event]) {
				delete this.listeners[event];
			}
		} else {
			if (Q._isString(callback) && target[callback]) {
				callback = target[callback];
			}
			var l = this.listeners && this.listeners[event];
			if (l) {
				for (var i = l.length - 1; i >= 0; i--) {
					if (l[i][0] === target) {
						if (!callback || callback === l[i][1]) {
							this.listeners[event].splice(i, 1);
						}
					}
				}
			}
		}
	},

	debind: function () {
		if (this.binds) {
			for (var i = 0, len = this.binds.length; i < len; i++) {
				var boundEvent = this.binds[i],
					source = boundEvent[0],
					event = boundEvent[1];
				source.off(event, this);
			}
		}
	}

});

Q.components = {};

Q.Evented.extend("Component",{
	init: function(entity) {
		this.entity = entity;
		if(this.extend) { Q._extend(entity,this.extend);   }
		entity[this.name] = this;

		entity.activeComponents.push(this.componentName);

		if(entity.stage && entity.stage.addToList) {
			entity.stage.addToList(this.componentName,entity);
		}
		if(this.added) { this.added(); }
	},

	destroy: function() {
		if(this.extend) {
			var extensions = Q._keys(this.extend);
			for(var i=0,len=extensions.length;i<len;i++) {
				delete this.entity[extensions[i]];
			}
		}
		delete this.entity[this.name];
		var idx = this.entity.activeComponents.indexOf(this.componentName);
		if(idx !== -1) {
			this.entity.activeComponents.splice(idx,1);

			if(this.entity.stage && this.entity.stage.addToList) {
				this.entity.stage.addToLists(this.componentName,this.entity);
			}
		}
		this.debind();
		if(this.destroyed) { this.destroyed(); }
	}
});

Q.Evented.extend("GameObject",{
	has: function(component) {
		return this[component] ? true : false;
	},

	add: function(components) {
		components = Q._normalizeArg(components);
		if(!this.activeComponents) { this.activeComponents = []; }
		for(var i=0,len=components.length;i<len;i++) {
			var name = components[i],
			Comp = Q.components[name];
			if(!this.has(name) && Comp) {
				var c = new Comp(this);
				this.trigger('addComponent',c);
			}
		}
		return this;
	},

	del: function(components) {
		components = Q._normalizeArg(components);
		for(var i=0,len=components.length;i<len;i++) {
			var name = components[i];
			if(name && this.has(name)) {
				this.trigger('delComponent',this[name]);
				this[name].destroy();
			}
		}
		return this;
	},

	destroy: function() {
		if(this.isDestroyed) { return; }
		this.trigger('destroyed');
		this.debind();
		if(this.stage && this.stage.remove) {
			this.stage.remove(this);
		}
		this.isDestroyed = true;
		if(this.destroyed) { this.destroyed(); }
	}
});

Q.GameObject.extend('Entity', {
	init: function(props, defaultProps) {
		this.p = defaultProps;

		Q._extend(this.p, props);
	},
});

Q.component = function(name,methods) {
	if(!methods) { return Q.components[name]; }
	methods.name = name;
	methods.componentName = "." + name;
	return (Q.components[name] = Q.Component.extend(name + "Component",methods));
};

module.exports = Q;
