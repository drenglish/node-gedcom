var through = require('through2'),
	{tokenStream} = require('./tokenizer'),
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
			cb => {
				if (_me.memo) {
					_me.push(_me.memo.fold());
				}
				cb(null);
			}
		);
		_me.parse = src => {
			let ts = tokenStream(src),
				t = through.obj();
			t.pipe(_me);

			ts.onValue(tok => {
				t.push(tok);
				return () => {};
			});

			ts.onEnd(() => { t.push(null);return () => {}; });
		}
		return _me;
	}
}
module.exports = Parser;
