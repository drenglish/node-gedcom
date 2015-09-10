var GED = require('./base');

const surnameRE = /\/([^/]*)\//;
const typeId = 'http://gedcomx.org/v1/Name';
const level = 1;

class NameGedx {
	constructor() {
		this.typeId = typeId;
		this.nameForms = [];
	}
}

class Name extends GED {
	constructor() {
		super();
		this.gedx = new NameGedx();
	}

	get level() {
		return level;
	}

	[GED.Symbols.Fold](node) {
		let name = {
			typeId: 'http://gedcomx.org/v1/NameForm',
			fullText: node.value.replace(/\//g,'')
		};
		if (surnameRE.test(node.value)) {
			name.parts = [];
			name.parts.push({
				type: 'http://gedcomx.org/Surname',
				value: node.value.match(surnameRE)[1]
			});
		}
		this.gedx.nameForms.push(name);
	}
}

Name.typeId = typeId;
module.exports = Name;
