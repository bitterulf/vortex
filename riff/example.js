const Q = require('./reducedQuintus.js');

Q.component('greeter', {
	added: function () {
		this.entity.p.greetCounter = 0;
	},

	refillAmmo: function () {
		this.entity.p.ammo = 60;
	},

	extend: {
		greet: function () {
			this.p.greetCounter++;

			if (this.p.greetCounter < 2) {
				return console.log('greetings for the first time');
			}
			console.log('greetings');
		}
	}
});

Q.component('hat', {
	added: function () {
		this.entity.trigger('equipmentChanged');
	},
	getArmor: function () {
		return 10;
	}
});

Q.component('equiper', {
	added: function () {
		this.entity.p.equipment = [];
		this.entity.p.slots = ['leftHand', 'rightHand'];
	},
	extend: {
		equip: function (equipment, slot) {
			if (equipment.has('equipable') && equipment.p.id) {
				this.p.equipment.push(equipment);
				equipment.trigger('equiped', this);
			}
		},
		isEquiped: function (equipment) {
			return !!this.p.equipment.find(function(equ) {
				return equ.p.id == equipment.p.id;
			});
		},
		unequip: function (id) {
			const that = this;
			this.p.equipment = this.p.equipment.filter(function(equ) {
				if (equ.p.id == id) {
					equ.trigger('unequiped', that);
					return false;
				}
				return true;
			});
		}
	}
});

Q.Entity.extend('Character', {
	init: function (p) {
		this._super(p, {
			name: 'unknown',
			x: 0,
			y: 0
		});

		this.on('talk');
		this.on('equipmentChanged');
	},
	talk: function() {
		console.log('hi i am', this.p.name);
	},
	equipmentChanged: function() {
		console.log('should recalculate equipment stats', this);
	}
});

Q.component('equipable', {
	added: function () {
		this.entity.on('equiped');
		this.entity.on('unequiped');
	},
	extend: {
		equiped: function(character) {
			console.log(this.p.name, this.p.id, 'was equiped by ', character.p.name);
		},
		unequiped: function(character) {
			console.log(this.p.name, this.p.id, 'was unequiped by ', character.p.name);
		}
	}
});

Q.Entity.extend('Weapon', {
	init: function (p) {
		this._super(p, {
			name: 'unknown weapon',
			damage: 1
		});

		this.add('equipable');
	}
});

var knife = new Q.Weapon({id: 'a123'});
var bob = new Q.Character({name: 'bob'});

bob.add('greeter');
bob.add('equiper');

bob.add('hat', {lala: true});

bob.trigger('talk');

bob.greet();
bob.greet();

bob.greet();

bob.equip(knife, 'leftHand');
console.log(bob.isEquiped(knife));
bob.unequip(knife.p.id);
console.log(bob.isEquiped(knife));
