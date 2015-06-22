var path = require('path');

var MAPPINGS = [
	{
		'INDI': 'Person'
	},
	{
		'NAME': 'Name'
	}
];

module.exports.get = function(entry) {
	try {
		var mapping = MAPPINGS[entry.level];
		var mapped = require( path.join(process.cwd(), 'lib/gedx-objects/', mapping[entry.tag]) );
		return new mapped();
	}
	catch (err) {
		return null;
	}
};
