var byline = require('byline'),
	Bacon = require('baconjs');

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

function tokenizeLine(chunk) {
	let [matched, level, , ptr, tag, value] = chunk.match(lineRE);
	if (matched) {
		tag = (ptr? value.trim() : tag); //If there's a pointer, the last group contains the tag
		return {
			level: parseInt(level),
			tag: tag,
			pointer: ptr,
			value: value
		}
	}
}

exports.tokenStream = function(src) {
	return Bacon.fromBinder(sink => {
		let ls = byline(src, {encoding: 'utf8'});
		ls.on('data', chunk => { sink(new Bacon.Next(tokenizeLine(chunk))) });
		ls.on('end', () => { sink(new Bacon.End()) });

		return () => {}
	});
}

exports.recordStream = function(src, level) {

}

