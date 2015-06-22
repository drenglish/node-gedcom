var should = require('should'),
	through = require('through2'),
	fs = require('fs'),
	path = require('path'),
	comp = require('../lib/composer'),
	Person = require('../lib/gedx-objects/Person');

describe('A GEDX object', function() {
	it('should be foldable', function() {
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
describe('A GEDCOM X object composer', function() {
	it('should emit a stream of compliant objects', function(cb) {
		var c = comp(),
			t = through.obj(),
			stack = [];

		t.pipe(c);
		c.on('data', function(o) {
			stack.push(o);
		});
		c.on('end', function() {
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
});
