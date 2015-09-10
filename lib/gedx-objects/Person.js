var GED = require('./base');

const typeId = 'http://gedcomx.org/v1/Person';
const level = 0;
const fieldMappings = {
	'http://gedcomx.org/v1/Name': 'names',
	'http://gedcomx.org/v1/Gender': 'gender'
}
const children = Object.keys(fieldMappings);

class PersonGedx {
	constructor() {
		this.typeId = typeId;
		this.identifiers = [];
		this.gender = {};
		this.names = [];
		this.facts = [];
	}
}

class Person extends GED {
	constructor() {
		super();
		this.gedx = new PersonGedx();
	}

	get level() {
		return level;
	}

	hasChild(test) {
		return test? children.indexOf(test.gedx.typeId) > -1 : false;
	}

	addChild(child) {
		let target = fieldMappings[child.gedx.typeId];
		if (target) {
			if (typeof this.gedx[target].push === 'function') {
				this.gedx[target].push(child.fold());
			}
			else {
				this.gedx[target] = child.fold();
			}
		}
		return target;
	}

	[GED.Symbols.Fold](node) {
		this.gedx.identifiers.push({value: node.pointer});
	}
}

Person.typeId = typeId;
module.exports = Person;
