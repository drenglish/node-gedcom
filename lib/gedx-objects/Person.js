var GED = require('./base');

var Person = function() {
	GED.call(this);
	this.gedx = {
			typeId: Person.typeId,
			identifiers: [],
			gender: {},
			names: [],
			facts: []
	};
}
Person.typeId = 'http://gedcomx.org/v1/Person';
Person.fieldMappings = {
	'http://gedcomx.org/v1/Name': 'names',
	'http://gedcomx.org/v1/Gender': 'gender'
}
Person.children = Object.keys(Person.fieldMappings);

Person.prototype = Object.create(GED.prototype, {
	'level': {
		value: 0
	},
	'hasChild': {
		value: function(test) {
			return !!test? Person.children.indexOf(test.gedx.typeId) > -1 : false;
		}
	},
	'addChild': {
		value: function(child) {
			var target = Person.fieldMappings[child.gedx.typeId];
			var mygedx = this.gedx;
			if (!!target) {
				if (typeof mygedx[target].push === 'function') {
					mygedx[target].push(child.fold());
				}
				else {
					mygedx[target] = child.fold();
				}
			}
		}
	},
	'fold': {
		value: function() {
			return GED.fold.call(this, function(node) {
				this.gedx.identifiers.push({value: node.pointer});
			});
		}
	}
});

module.exports = Person;
