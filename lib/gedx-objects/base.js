var bridge = require('../bridge');

function GED() {
	this.stack = [];
	this.gedx = {};
}
GED.prototype = {
	push: function(entry) {
		this.stack.push(entry);
	},
	hasChild: function(test) {
		return false;
	},
	addChild: function(child) {
		return null;
	}
}

GED.fold = function(delegate) {
	var _me = this,
		working, mapped;
	_me.stack.forEach(function(node) {
		if (_me.level === node.level) {
			delegate.call(_me, node);
		}
		else {
			mapped = bridge.getMapped(node);
			if (_me.hasChild(mapped)) {
				if (!!working) {
					_me.addChild(working);
				}
				working = mapped;
				working.push(node);
			}

			if (!!working && node.level > working.level) {
				working.push(node);
			}
		}
	});
	if (!!working) { _me.addChild(working); }
	return _me.gedx;
}

module.exports = GED;
