var chai = require('chai'),
	fs = require('fs'),
	path = require('path'),
	{tokenStream} = require('../lib/Tokenizer');

chai.should();

var gedtext = fs.readFileSync(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}),
	lineCount = gedtext.match(/^.+/gm).length,
	persCount = gedtext.match(/^0.+INDI/gm).length;

describe('A GED file tokenizer', () => {
	it('should map all non-blank input lines', (cb) => {
		let ts = tokenStream( fs.createReadStream(path.join(process.cwd(),'ged/family.ged')) );
		let total = 0;

		ts.onValue(tok => {
			total++;
			return () => { total = 0; }
		});
		ts.onEnd(() => {
			lineCount.should.equal(total);
			cb();

			return () => { total = 0; }
		});
	});
	it('should emit proper tokens for every person entry', (cb) => {
		let ts = tokenStream( fs.createReadStream(path.join(process.cwd(),'ged/family.ged')) );
		let total = 0;

		ts.onValue(tok => {
			if (tok.level === 0 && tok.tag === 'INDI') total++;
			return () => { total = 0; }
		});
		ts.onEnd(() => {
			persCount.should.equal(total);
			cb();

			return () => { total = 0; }
		});
	});
});
