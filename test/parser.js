var chai = require('chai'),
	through = require('through2'),
	fs = require('fs'),
	path = require('path'),
	Parser = require('../lib/Parser'),
	Person = require('../lib/gedx-objects/Person');

chai.should();

describe('A GEDX object', () => {
	it('should be foldable', () => {
		var p = new Person();
		p.push({level:0,pointer:'@P1@',tag:'INDI'});
		p.push({level:1,tag:'NAME',value:'Michael Dennis /Dietz/'});
		var gedx = p.fold();
		gedx.identifiers.should.be.an.Array;
		gedx.identifiers[0].should.have.property('value');
		gedx.identifiers[0].value.should.equal('@P1@');
		gedx.names[0].nameForms[0].fullText.should.equal('Michael Dennis Dietz');
	});
});
describe('A GEDCOM X object parser', () => {
	it('should emit a stream of compliant objects', (cb) => {
		var c = new Parser(),
			t = through.obj(),
			stack = [];

		t.pipe(c);
		c.on('data', (o) => {
			stack.push(o);
		});
		c.on('end', () => {
			stack.length.should.equal(1);
			stack[0].typeId.should.equal('http://gedcomx.org/v1/Person');
			stack[0].identifiers[0].should.have.property('value');
			stack[0].identifiers[0].value.should.equal('@P1@');
			stack[0].names[0].nameForms[0].fullText.should.equal('Michael Dennis Dietz');
			cb();
		});
		t.push({level:0,pointer:'@P1@',tag:'INDI'});
		t.push({level:1,tag:'NAME',value:'Michael Dennis /Dietz/'});
		t.push(null);
	});
	it('should emit as many Person objects as there are INDI lines in an input file', function(cb) {
		this.timeout(5000);

		var gedtext = fs.readFileSync(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}),
			persCount = gedtext.match(/^0.+INDI/gm).length;

		var c = new Parser(), stack = [];
		c.on('data', (o) => {
			if (o.typeId === Person.typeId) {
				stack.push(o);
			}
		});
		c.on('end', () => {
			stack.length.should.equal(persCount);
			cb();
		});
		c.parse(fs.createReadStream(path.join(process.cwd(),'ged/family.ged'), {encoding: 'utf8'}));
	});
});
