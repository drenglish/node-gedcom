var through = require('through2'),
	tok = require('./tokenizer'),
	bridge = require('./bridge');

module.exports = function() {
	var comp = through.obj(function(chunk, enc, cb) {
		var _me = this, mapped;

		if (chunk.level > 0) {
			if (!!_me.memo) _me.memo.push(chunk);
		}

		if (chunk.level === 0) {
			if (!!_me.memo) {
				_me.push(_me.memo.fold());
				delete _me.memo;
			}
			mapped = bridge.getMapped(chunk);
			if (!!mapped) {
				_me.memo = mapped;
				_me.memo.push(chunk);
			}
		}

		cb(null);
	},
	function(cb) {
		var _me = this;
		if (!!_me.memo) {
			_me.push(_me.memo.fold());
		}
		cb(null);
	});
	comp.parse = function(instream) {
		var t = tok(instream), _me = this;

		t.pipe(_me);
		t.on('end', function() {_me.push(null);});
		t.start();
	}
	return comp;
}
