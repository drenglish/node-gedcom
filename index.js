var fs = require('fs'),
	GEDParse = require('./lib/Parser');

var parser = new GEDParse();
parser.on('data', function(details) {
	console.log(details);
});
parser.on('end', function(parseCount, total) {
	console.log('Parsed '+parseCount+' lines of '+total);
});
parser.parse(fs.createReadStream('./ged/family.ged', {encoding: 'utf8'}));
