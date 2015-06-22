var GED = require('./base');

var Person = function() {
	GED.call(this);

	this.gedx = {
		typeId: 'http://gedcomx.org/v1/Person',
		identifiers: [],
		gender: null,
		names: [],
		facts: []
	}
	this.hints = {
		'http://gedcomx.org/v1/Name': 'names'
	}
}
Person.prototype = Object.create(GED.prototype);
Person.prototype.fold = function() {
	var _me = this, working;
	_me.stack.forEach(function(node) {
		if (node.level === 0) {
			_me.gedx.identifiers.push({value: node.pointer});
		}
		else {
			if (node.level === 1) {
				_me.setChild(working);
				working = _me.bridge(node);
			}
			if (!!working) {
				working.push(node);
			}
		}
	});
	_me.setChild(working);
	return _me.gedx;
}

module.exports = Person;
