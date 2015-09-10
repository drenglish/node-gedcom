var mappings = require('../mappings'),
	path = require('path');

class GED {
	constructor() {
		this.stack = [];
		this.gedx = {};
	}

	get level() {
		return 0;
	}

	push(node) {
		this.stack.push(node);
	}

	hasChild(test) {
		return false;
	}

	addChild(child) {
		return null;
	}

	fold() {
		let working, mapped;
		this.stack.forEach( (node) => {
			if (this.level === node.level) {
				this[GED.Symbols.Fold](node);
			}
			else {
				mapped = GED.getMapped(node);
				if (this.hasChild(mapped)) {
					if (working) {
						this.addChild(working);
					}
					working = mapped;
					working.push(node);
				}

				if (working && node.level > working.level) {
					working.push(node);
				}
			}
		} );
		if (working) { this.addChild(working); }
		return this.gedx;
	}
}

GED.Symbols = {};
GED.Symbols.Fold = Symbol('fold');
GED.getMapped = (node) => {
	let mapping = mappings[node.level];
	if (mapping) {
		try {
			let mapped = require( path.join(process.cwd(), 'lib/gedx-objects/', mapping[node.tag]) );
			return new mapped();
		}
		catch (err) { return null; }
	}
}

module.exports = GED;
