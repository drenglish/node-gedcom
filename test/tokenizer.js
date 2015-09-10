var chai = require('chai'),
	fs = require('fs'),
	path = require('path'),
	Tokenizer = require('../lib/Tokenizer');

chai.should();

var gedtext = fs.readFileSync(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}),
	lineCount = gedtext.match(/^.+/gm).length,
	persCount = gedtext.match(/^0.+INDI/gm).length;

describe('A GED file tokenizer', () => {
	it('should match against all non-blank input lines', (cb) => {
		let tokenizer = new Tokenizer({parse: false}),
			total = 0;

		tokenizer.on('data', function(tokenized) {
			total++;
		})

		tokenizer.on('end', function() {
			lineCount.should.equal(total);
			cb();
		});
		tokenizer.tokenize(fs.createReadStream(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}));
	});
	it('should emit proper tokens for every person entry', (cb) => {
		var tokenizer = new Tokenizer();
		var indiTokens = 0;

		tokenizer.on('data', function(tokenized) {
			if (tokenized.level === 0 && tokenized.tag === 'INDI') indiTokens++;
		});

		tokenizer.on('end', function() {
			indiTokens.should.equal(persCount);
			cb();
		});
		tokenizer.tokenize(fs.createReadStream(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}));
	});
});
