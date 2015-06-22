var bridge = require('../bridge');

function GED() {
	this.stack = [];
	this.gedx = {};
	this.hints = {};
}
GED.prototype = {
	push: function(entry) {
		this.stack.push(entry);
	},
	setChild: function(o) {
		if (!o) return;

		var folded = o.fold();
		if (!!this.hints[folded.typeId]) {
			var field = this.gedx[this.hints[folded.typeId]];
			if (typeof field.push === 'function') {
				field.push(folded);
			}
			else {
				field = folded;
			}
		}
	},
	bridge: function(entry) {
		return bridge.get(entry);
	}
}

module.exports = GED;
