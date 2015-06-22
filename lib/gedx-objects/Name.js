var GED = require('./base');

var Name = function() {
	GED.call(this);

	this.gedx = {
		typeId: 'http://gedcomx.org/v1/Name',
		nameForms: []
	}
}
var surnameRE = /\/([^/]*)\//;
Name.prototype = Object.create(GED.prototype);
Name.prototype.fold = function() {
	var _me = this;
	_me.stack.forEach(function(node) {
		var name = {
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
		_me.gedx.nameForms.push(name);
	});
	return _me.gedx;
}

module.exports = Name;
