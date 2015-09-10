var through = require('through2'),
	byline = require('byline');

const lineRE = /([0-9]+)\s((@[-_A-Z0-9]*@)|([-_A-Z0-9]*))+\s?(.*)?/; //TODO: last value might be a source pointer; add that check

const GED_TAGS = [
	[ /* level 0 */
		'INDI',
		'FAM',
		'SOUR'
	],
	[ /* level 1 */
		'NAME',
		'BIRT',
		'BAPM',
		'DEAT',
		'BURI',
		'SEX',
		'RESI',
		'FAMC',
		'OCCU'
	],
	[ /* level 2 */
		'DATE',
		'PLAC',
		'SOUR',
		'CONC'
	],
	[ /* level 3 */
		'NOTE',
		'DATA',
		'PAGE'
	],
	[ /* level 4 */
		'DATE'
	]
];

class Tokenizer {
	constructor({parse = true} = {}) {
		let options = {};
		options.parse = parse;

		let _me = through.obj();
		_me.tokenize = function(src) {
			let ls = byline(src, {encoding: 'utf8'});

			ls.on('readable', () => {
				let line;
				while (null !== (line = ls.read())) {
					let [matched, level, , ptr, tag, value] = line.match(lineRE);
					if (!options.parse) return _me.push(line);

					level = parseInt(level);
					if (matched && GED_TAGS[level]) {
						tag = ptr? value.trim() : tag; //If there's a pointer, the last group contains the tag
						if (GED_TAGS[level].indexOf(tag) > -1) { //No "contains" in ES6, sigh
							_me.push({
								level: level,
								tag: tag,
								pointer: ptr,
								value: value
							});
						}
					}
				}
			});
			ls.on('end', () => { _me.push(null) });
		}
		return _me;
	}
}
module.exports = Tokenizer;
