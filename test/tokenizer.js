var should = require('should'),
	fs = require('fs'),
	path = require('path'),
	tok = require('../lib/tokenizer');

var gedtext = fs.readFileSync(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}),
	lineCount = gedtext.match(/^.+/gm).length,
	persCount = gedtext.match(/^0.+INDI/gm).length;

describe('A GED file tokenizer', function() {
	it('should match against all non-blank input lines', function(cb) {
		var tokenizer = tok(fs.createReadStream(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}), {parse: false}),
			total = 0;

		tokenizer.on('data', function(tokenzed) {
			total++;
		})

		tokenizer.on('end', function() {
			lineCount.should.equal(total);
			cb();
		});
		tokenizer.start();
	});
	it('should emit proper tokens for every person entry', function(cb) {
		var tokenizer = tok(fs.createReadStream(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}));
		var indiTokens = 0;

		tokenizer.on('data', function(tokenized) {
			if (tokenized.level === 0 && tokenized.tag === 'INDI') indiTokens++;
		});

		tokenizer.on('end', function() {
			indiTokens.should.equal(persCount);
			cb();
		});
		tokenizer.start();
	});
});
