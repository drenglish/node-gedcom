var fs = require('fs'),
	GEDParse = require('./lib/tokenizer');

var parser = new GEDParse(fs.createReadStream('./ged/family.ged', {encoding: 'utf8'}));
parser.on('data', function(details) {
	console.log(details);
});
parser.on('end', function(parseCount, total) {
	console.log('Parsed '+parseCount+' lines of '+total);
});
parser.start();
