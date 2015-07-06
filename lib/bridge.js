var path = require('path');

var MAPPINGS = [
	{
		'INDI': 'Person'
	},
	{
		'NAME': 'Name',
		'SEX': 'Gender',
		'BIRT': 'Fact',
		'DEAT': 'Fact'
	},
	{
		'DATE': 'Date',
		'PLAC': 'PlaceDescription'
	}
];

module.exports.getMapped = function(entry) {
	var mapping = MAPPINGS[entry.level], mapped;
	if (!!mapping) {
		try {
			mapped = require( path.join(process.cwd(), 'lib/gedx-objects/', mapping[entry.tag]) );
			return new mapped();
		}
		catch (err) { return null; }
	}
};
