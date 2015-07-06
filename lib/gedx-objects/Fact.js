var GED = require('./base');

var Fact = function() {
	GED.call(this);
	this.gedx = {
		typeId: Fact.typeId
	}
}
Fact.typeId = 'http://gedcomx.org/v1/Fact';
Fact.prototype = Object.create(GED.prototype, {
	'fold': {
		value: function() {
			return this.gedx;
		}
	}
});

module.exports = Fact;
