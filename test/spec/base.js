define('spec/base', ['flockn/base'], function(Base) {
  'use strict';
  
  describe('flockn/base', function() {
    
    it('is a function', function() {
      expect(Base).to.be.a('function');
    });
    
    describe('constructor', function() {
      it('can be instantiated', function() {
        var base = new Base();

        expect(base).to.be.a('object');
        expect(base).to.be.an.instanceOf(Base);
      });
      
    });
    
    
  });
  
});
