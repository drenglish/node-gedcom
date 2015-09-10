var GED = require('./base');

const typeId = 'http://gedcomx.org/v1/Gender';
const valueMap = {
	'M': 'http://gedcomx.org/v1/Male',
	'F': 'http://gedcomx.org/v1/Female',
	'U': 'http://gedcomx.org/v1/Unknown'
};

class Gender extends GED {
	constructor() {
		super();
		this.gedx = {
			typeId: typeId
		};
	}

	fold() {
		this.gedx.type = valueMap[this.stack[0].value];
		return this.gedx;
	}
}

Gender.typeId = typeId;
module.exports = Gender;
