var GED = require('./base');

var surnameRE = /\/([^/]*)\//;

var Name = function() {
	GED.call(this);
	this.gedx = {
		typeId: Name.typeId,
		nameForms: []
	}
}
Name.typeId = 'http://gedcomx.org/v1/Name';
Name.prototype = Object.create(GED.prototype, {
	'level': {
		value: 1
	},
	'fold': {
		value: function() {
			return GED.fold.call(this, function(node) {
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
				this.gedx.nameForms.push(name);
			});
		}
	}
});

module.exports = Name;
