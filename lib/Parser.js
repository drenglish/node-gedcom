var through = require('through2'),
	Tokenizer = require('./Tokenizer'),
	GED = require('./gedx-objects/base');

class Parser {
	constructor() {
		let _me = through.obj(
			(chunk, enc, cb) => {
				let mapped;

				if (chunk.level > 0) {
					if (_me.memo) _me.memo.push(chunk);
				}

				if (chunk.level === 0) {
					if (_me.memo) {
						_me.push(_me.memo.fold());
						delete _me.memo;
					}
					mapped = GED.getMapped(chunk);
					if (mapped) {
						_me.memo = mapped;
						_me.memo.push(chunk);
					}
				}

				cb(null);
			},
			(cb) => {
				if (_me.memo) {
					_me.push(_me.memo.fold());
				}
				cb(null);
			}
		);
		_me.parse = (src) => {
			let t = new Tokenizer();
			t.pipe(_me);
			t.on('end', () => { _me.push(null) });
			t.tokenize(src);
		}
		return _me;
	}
}
module.exports = Parser;
