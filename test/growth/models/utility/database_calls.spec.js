const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect;
const assert = chai.assert;
const mysql = require("mysql")

let dbcalls
function resetModules() {
  delete require.cache[require.resolve('../../../../models/utility/database_calls')];
  dbcalls = require('../../../../models/utility/database_calls');
}

describe('database_calls.js tests', function() {
  describe('getPool() tests', function() {
    beforeEach(function() {
      resetModules()
    })
    it('should create and return a database pool object', function() {
      let config = {database:null};
      let mysql_stub = sinon.stub(mysql, 'createPool').returns('test')
      let res = dbcalls.getPool(config)
      assert.deepEqual(res, 'test')
      sinon.assert.calledOnce(mysql_stub)
    })
    
    it('should call createPool() only once', function() {
      let config = {database:null};
      let mysql_stub = sinon.stub(mysql, 'createPool').returns('test')
      dbcalls.getPool(config)
      let res = dbcalls.getPool()
      assert.deepEqual(res, 'test')
      sinon.assert.calledOnce(mysql_stub)
    })
  })

  describe('testConnectivity() tests', function() {
    it('should resolve with results', async function() {
      let test_result = { data : 1 }
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.testConnectivity().then((results)=> {
        expect(results).to.be.deep.equal(test_result)
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.testConnectivity().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addOutput() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addOutput().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addOutput().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addSensor() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addSensor().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addSensor().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addUser() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addUser().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addUser().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addSensorReading() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addSensorReading().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addSensorReading().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('removeSensor() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.removeSensor().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.removeSensor().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getOutputs() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getOutputs().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getOutputs().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getAllUsers() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllUsers().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllUsers().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getOrderedOutputs() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getOrderedOutputs().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getOrderedOutputs().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getSensors() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensors().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensors().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getSensorLastReadings() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensorLastReadings().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensorLastReadings().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getSensorLastReadingsByHours() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensorLastReadingsByHours().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensorLastReadingsByHours().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getUser() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getUser().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getUser().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('updateSensorAddress() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateSensorAddress().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateSensorAddress().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('updateOutput() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateOutput().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateOutput().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('updateSensor() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateSensor().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateSensor().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })
})