const Q = require('./reducedQuintus.js');

Q.component('logable', {
	added: function () {
	},
	extend: {
		log: function(message) {
			console.log('logging', this.className, message);
		}
	}
});

Q.Entity.extend('Store', {
	init: function (p) {
		this._super(p, {
			state: {
				counter: 0
			}
		});
		this.on('dispatch');
	},
	dispatch: function(data) {
		if (data.action == 'count') {
			this.p.state.counter += data.payload.amount;
			this.trigger('stateChange', JSON.parse(JSON.stringify(this.p.state)));
		}
	}
});

Q.Entity.extend('Bus', {
	init: function (p) {
		this._super(p, {});
	},
	on: function(event,target,callback) {
		this.log('listen: '+event);
		this._super(event,target,callback);
	},
	trigger: function (event, data) {
		this.log('trigger: '+event);
		this._super(event, data);
	},
	off: function(event,target,callback) {
		this.log('unlisten: '+event);
		this._super(event,target,callback);
	}
});

const bus = new Q.Bus({});

bus.add('logable');

const store = new Q.Store({});

store.add('logable');

store.on('stateChange', null, function(state) {
	console.log('new state', state);
});

const handleDispatch = function(data) {
	console.log('dispatched', data);
};

bus.on('dispatch', null, handleDispatch);

bus.trigger('dispatch', {data: true});

bus.off('dispatch', null, handleDispatch);

bus.trigger('dispatch', {data: true});

store.trigger('dispatch', {action: 'count', payload: {amount: 1}});
store.trigger('dispatch', {action: 'count', payload: {amount: 2}});
