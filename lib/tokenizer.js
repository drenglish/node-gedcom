var through = require('through2'),
	byline = require('byline');

var lineRE = /([0-9]+)\s((@[-_A-Z0-9]*@)|([-_A-Z0-9]*))+\s?(.*)?/,
	pointerRE = /@[-_A-Z0-9]*@/;

var GED_TAGS = [
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

module.exports = function(instream, options) {
	var opt = {parse: true};
	if (!!options && typeof options.parse === 'boolean') opt.parse = options.parse;
	var tok = through.obj();
	tok.start = function() {
		var lineStream = byline(instream, {encoding: 'utf8'}),
			tag, pointer, parseItems,
			_me = this;

		lineStream.on('readable', function() {
			var line, parsed;
			while (null !== (line = lineStream.read())) {
				parsed = line.match(lineRE);
				if (!opt.parse) return tok.push(parsed);

				if (parsed !== null) {
					if (!!GED_TAGS[parsed[1]]) {
						parseItems = [parsed[1],parsed[2]];
						if (!!parsed[5]) { parseItems.push(parsed[5].trim()); }
						tag = pointerRE.test(parsed[3])? parsed[5].trim() : parsed[4];

						if (GED_TAGS[parsed[1]].indexOf(tag) > -1) {
							tok.push({
								level: parseInt(parseItems[0]),
								tag: tag,
								pointer: parsed[3] || '',
								value: !!parsed[5]? parsed[5].trim() : '',
								parsed: parseItems
							});
						}
					}
				}
			}
		});
		lineStream.on('end', function() {
			tok.push(null);
		});
	}
	return tok;
}
