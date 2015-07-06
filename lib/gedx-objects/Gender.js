var GED = require('./base');

var Gender = function() {
	GED.call(this);
	this.gedx = {
		typeId: Gender.typeId
	}
}
Gender.typeId = 'http://gedcomx.org/v1/Gender';
Gender.valueMap = {
	'M': 'http://gedcomx.org/v1/Male',
	'F': 'http://gedcomx.org/v1/Female',
	'U': 'http://gedcomx.org/v1/Unknown'
}
Gender.prototype = Object.create(GED.prototype, {
	'fold': {
		value: function() {
			this.gedx.type = Gender.valueMap[this.stack[0].value];
			return this.gedx;
		}
	}
});

module.exports = Gender;
