var GED = require('./base');

const typeId = 'http://gedcomx.org/v1/Fact';

class Fact extends GED {
	constructor() {
		super();
		this.gedx = {
			typeId: typeId
		}
	}

	fold() {
		return this.gedx;
	}
}

module.exports = Fact;
