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

  describe('addNewOutput() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewOutput().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewOutput().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addNewOutputType() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewOutputType().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewOutputType().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })


  describe('addNewSensor() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewSensor().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewSensor().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addNewSensorType() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewSensorType().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewSensorType().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('addNewUser() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewUser().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.addNewUser().then(function() {
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

  describe('disableOutputType() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.disableOutputType().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.disableOutputType().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('disableOutput() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.disableOutput().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.disableOutput().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('disableSensor() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.disableSensor().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.disableSensor().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getAllOutputs() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllOutputs().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllOutputs().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getAllOutputTypes() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllOutputTypes().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllOutputTypes().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getAllSensors() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllSensors().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllSensors().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getAllSensorTypes() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllSensorTypes().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getAllSensorTypes().then(function() {
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

  describe('getEnabledOutputs() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledOutputs().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledOutputs().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getEnabledOrderedOutputs() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledOrderedOutputs().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledOrderedOutputs().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getEnabledOutputTypes() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledOutputTypes().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledOutputTypes().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getEnabledSensors() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledSensors().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledSensors().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getEnabledSensorTypes() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledSensorTypes().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledSensorTypes().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })

  describe('getEnabledSensorTypes() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledSensorTypes().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getEnabledSensorTypes().then(function() {
        assert.fail()
      }).catch(function(error) {
        expect(error).to.be.an('error')
      })
    })
  })
  
  describe('getSensorDataByType() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensorDataByType().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.getSensorDataByType().then(function() {
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

  describe('updateOutputType() tests', function() {
    it('should resolve with results', async function() {
      let test_result = [{ data : 1 }]
      const connStub = { query: sinon.stub().yields(undefined, test_result), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateOutputType().then((results)=> {
        expect(results).to.be.deep.equal(test_result[0])
      }).catch(function() {
        assert.fail()
      })
    })
    it('should reject with error', async function() {         
      const connStub = { query: sinon.stub().yields(new Error("ERROR!")), release: sinon.stub() };            
      sinon.stub(dbcalls, "getPool").resolves(connStub); 
      await dbcalls.updateOutputType().then(function() {
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