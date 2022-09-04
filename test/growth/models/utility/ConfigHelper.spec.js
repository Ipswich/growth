const chai = require('chai');
const sinon = require('sinon');
const readline = require('readline');
const fs = require('fs');
const expect = chai.expect;
const assert = chai.assert;

let ConfigHelper

function resetModules() {
  delete require.cache[require.resolve('../../../../models/utility/ConfigHelper')];
  ConfigHelper = require('../../../../models/utility/ConfigHelper');
}

describe('ConfigHelper.js tests: ', function() {

  

  describe('getInput() tests', function() {
    beforeEach(function() {
      resetModules();
    });
    it('should print query', async function() {
      const readlineInterfaceStub = {
        question: sinon.stub().callsFake((query, callback) => {
          callback('input');
        }),
        close: sinon.stub(),
      };
      sinon.stub(readline, 'createInterface').returns(readlineInterfaceStub);
      await ConfigHelper.getInput('QUERY!')
      sinon.assert.calledWithExactly(readlineInterfaceStub.question, 'QUERY!', sinon.match.func);
      sinon.assert.calledOnce(readlineInterfaceStub.close);    
    })

    it('should return input', async function() {
      const readlineInterfaceStub = {
        question: sinon.stub().callsFake((query, callback) => {
          callback('input');
        }),
        close: sinon.stub(),
      };
      sinon.stub(readline, 'createInterface').returns(readlineInterfaceStub);
      const actual = await ConfigHelper.getInput()
      expect(actual).to.be.eql('input')
      sinon.assert.calledOnce(readlineInterfaceStub.close);
    });
  });

  describe('initializeConfig() tests', function() {
    beforeEach(function() {
      resetModules();
    });
    it('should resolve with the system config', async function() {
      const expected_string = '{"data" : "data"}'
      const expected_object = JSON.parse(expected_string).toString()
      sinon.stub(fs, 'existsSync').returns(true)
      sinon.stub(fs, 'readFileSync').callsFake(() => expected_string)
      let actual = await ConfigHelper.initializeConfig()
      assert.equal(actual, expected_object)
    })
    it('should copy the default config and resolve with it', async function() {
      const expected_string = '{"data" : "data"}'
      const expected_object = JSON.parse(expected_string).toString()
      sinon.stub(fs, 'existsSync').returns(false)
      sinon.stub(fs, 'copyFileSync').returns(undefined)
      sinon.stub(fs, 'readFileSync').returns(expected_string)
      let actual = await ConfigHelper.initializeConfig()
      assert.equal(actual, expected_object)
    })
    it('should reject promise on failed config copy', async function() {
      sinon.stub(fs, 'existsSync').returns(false)
      sinon.stub(fs, 'copyFileSync').throws(new Error("ERROR!"))
      await ConfigHelper.initializeConfig().then(
        () => Promise.reject(new Error('Expected method to reject.')),
        err => assert.instanceOf(err, Error)
      );
    })
  })
  
  describe('initalizeWebData() tests', function() {
    beforeEach(function() {
      resetModules();
    });
    it('should resolve with the system config', async function() {
      const expected_string = '{"data" : "data"}'
      const expected_object = JSON.parse(expected_string).toString()
      sinon.stub(fs, 'existsSync').returns(true)
      sinon.stub(fs, 'readFileSync').callsFake(() => expected_string)
      let actual = await ConfigHelper.initializeWebData()
      assert.equal(actual, expected_object)
    })
    it('should copy the default config and resolve with it', async function() {
      const expected_string = '{"data" : "data"}'
      const expected_object = JSON.parse(expected_string).toString()
      sinon.stub(fs, 'existsSync').returns(false)
      sinon.stub(fs, 'copyFileSync').returns(undefined)
      sinon.stub(fs, 'readFileSync').returns(expected_string)
      let actual = await ConfigHelper.initializeWebData()
      assert.equal(actual, expected_object)
    })
    it('should reject promise on failed config copy', async function() {
      sinon.stub(fs, 'existsSync').returns(false)
      sinon.stub(fs, 'copyFileSync').throws(new Error("ERROR!"))
      await ConfigHelper.initializeWebData().then(
        () => Promise.reject(new Error('Expected method to reject.')),
        err => assert.instanceOf(err, Error)
      );
    })
  })

  describe('getBoardData() tests', function() {
    it('should return an array of board data', function() {
      let stub_return = '{"test1" : "test1", "test2" : "test2"}'
      let expected = [JSON.parse(stub_return), 'test1, test2']
      sinon.stub(fs, 'readFileSync').returns(stub_return)
      let result = ConfigHelper.getBoardData()
      assert.hasAllKeys(expected[0], result[0])
      assert.equal(expected[1], result[1])
    })
    it('should error', function() {
      sinon.stub(fs, 'readFileSync').throws(new Error("ERROR!"))
      try {
        ConfigHelper.getBoardData()
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('boardCheck() tests', function() {
    beforeEach(function() {
      resetModules();
    });
    it('should return an array of a board object and "true"', async function() {
      let getBoardData_return = [ { test1: 'test1', test2: 'test2' }, 'test1, test2' ]
      sinon.stub(ConfigHelper, 'getInput').resolves("test1")
      sinon.stub(ConfigHelper, 'getBoardData').returns(getBoardData_return)
      let actual = await ConfigHelper.boardCheck({'board' : 'null'}, false)
      expect(actual[0]).to.be.eql({ board: 'test1' })
      expect(actual[1]).to.be.true
    })

    it('should return the passed object and "true"', async function() {
      let expected = { board: 'test1' }
      let actual = await ConfigHelper.boardCheck(expected, true)
      expect(actual[0]).to.be.eql(expected)
      expect(actual[1]).to.be.true
    })

    it('should throw an error', async function() {
      let expected = { board: 'null' }
      sinon.stub(ConfigHelper, 'getBoardData').throws(new Error("Error!"))
      try {
        await ConfigHelper.boardCheck(expected, true)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })    
  })

  describe('databaseCheck() tests', function() {
    beforeEach(function() {
      resetModules();
    });
    it('should return an array of a database object and "true"', async function() {
      let test_config = { database: { password: 'null' } }
      let expected = { database: { password: 'test1' } }
      sinon.stub(ConfigHelper, 'getInput').resolves("test1")
      let actual = await ConfigHelper.databaseCheck(test_config, false)
      expect(actual[0]).to.be.eql(expected)
      expect(actual[1]).to.be.true

    })
    it('should return the passed object and "true"', async function() {
      let expected = { database: { password: 'test1' } }
      let actual = await ConfigHelper.databaseCheck(expected, true)
      expect(actual[0]).to.be.eql(expected)
      expect(actual[1]).to.be.true
    })
  })

  describe('jwtCheck() tests', function() {
    it('should return an array of a jwt_secret object and "true"', async function() {
      let test_config = { jwt_secret: 'null' }
      let expected = { jwt_secret: 'test1' }
      sinon.stub(ConfigHelper, 'getInput').resolves("test1")
      let actual = await ConfigHelper.jwtCheck(test_config, false)
      expect(actual[0]).to.be.eql(expected)
      expect(actual[1]).to.be.true

    })
    it('should return the passed object and "true"', async function() {
      let expected = { jwt_secret: 'test1' }
      let actual = await ConfigHelper.jwtCheck(expected, true)
      expect(actual[0]).to.be.eql(expected)
      expect(actual[1]).to.be.true
    })
  })

  describe('nodeMailerCheck() tests', function() {
    beforeEach(function() {
      resetModules();
    });  
    it('should return a filled array of nodeMailer object, "true", and "true"', async function() {
      let test_config = {
        nodemailer: {
          auth: { user: 'null', pass: 'null' },
          service: 'null',
        },
        nodemailer_setup_warn : 'true'
      }
      let expected = {
        nodemailer: {
          auth: { user: 'test@example.com', pass: 'password' },
          service: 'gmail',
        },
        nodemailer_setup_warn : false
      }
      getInput_fn = sinon.stub(ConfigHelper, 'getInput').onCall(0).resolves('y')
      getInput_fn.onCall(1).resolves('gmail')
      getInput_fn.onCall(2).resolves('test@example.com')
      getInput_fn.onCall(3).resolves('password')
      let actual = await ConfigHelper.nodemailerCheck(test_config, false, true)
      expect(actual[0]).to.be.deep.equal(expected)
      expect(actual[1]).to.be.true
      expect(actual[2]).to.be.true


    })
    it('should return an array of the passed object, "false", and "false"', async function() {
      let test_config = {
        nodemailer: {
          auth: { user: 'null', pass: 'null' },
          service: 'null'
        },
        nodemailer_setup_warn : 'true'
      }
      let getInput_fn = sinon.stub(ConfigHelper, 'getInput').onCall(0).resolves('')
      getInput_fn.onCall(1).resolves('n')
      
      let actual = await ConfigHelper.nodemailerCheck(test_config, false, true)
      test_config.nodemailer_setup_warn = true 
      expect(actual[0]).to.be.deep.equal(test_config)
      expect(actual[1]).to.be.false
      expect(actual[2]).to.be.false
    })
    it('should return an array of the passed object, "true", and "false"', async function() {
      let test_config = {
        nodemailer: {
          auth: { user: 'null', pass: 'null' },
          service: 'null'
        },
        nodemailer_setup_warn : 'true'
      }
      let stub_input = sinon.stub(ConfigHelper, 'getInput')
      stub_input.onCall(0).resolves('')
      stub_input.onCall(1).resolves('')
      
      let actual = await ConfigHelper.nodemailerCheck(test_config, false, true)
      test_config.nodemailer_setup_warn = true
      expect(actual[0]).to.be.deep.equal(test_config)
      expect(actual[1]).to.be.true
      expect(actual[2]).to.be.false
    })
    it('should return an array of the passed object, "false", and "true"', async function() {
      let test_config = {
        nodemailer: {
          auth: { user: 'test', pass: 'test' },
          service: 'test'
        },
        nodemailer_setup_warn : 'true'
      }
      
      let actual = await ConfigHelper.nodemailerCheck(test_config, false, true)
      test_config.nodemailer_setup_warn = false   
      expect(actual[0]).to.be.deep.equal(test_config)
      expect(actual[1]).to.be.false
      expect(actual[2]).to.be.true
    })
  })

  describe('relayTogglePreventionCheck() tests', function() {
    beforeEach(function() {
      resetModules();
    });
    it('should return an array of an object with true, and "true"', async function() {
      let test_config = {
        relay_toggle_prevention : 'null'
      }
      sinon.stub(ConfigHelper, 'getInput').resolves('y')
      let actual = await ConfigHelper.relayTogglePreventionCheck(test_config, false)
      expect(actual[0].relay_toggle_prevention).to.be.true
      expect(actual[1]).to.be.true
    })
    it('should return an array of an object with false, and "true"', async function() {
      let test_config = {
        relay_toggle_prevention : 'null'
      }
      sinon.stub(ConfigHelper, 'getInput').resolves('n')
      let actual = await ConfigHelper.relayTogglePreventionCheck(test_config, false)
      expect(actual[0].relay_toggle_prevention).to.be.false
      expect(actual[1]).to.be.true
    })
    it('should return an array of the passed object with "test", and "false"', async function() {
      let test_config = {
        relay_toggle_prevention : 'test'
      }
      let actual = await ConfigHelper.relayTogglePreventionCheck(test_config, false)
      expect(actual[0].relay_toggle_prevention).to.be.deep.equal('test')
      expect(actual[1]).to.be.false
    })
  })

  describe('cameraCheck() tests', function(){
    beforeEach(function() {
      resetModules();
    });
    it('should return an array of an object with true, and "true"', async function() {
      let test_config = {
        camera: {
          enable: 'null'
        }
      }
      sinon.stub(ConfigHelper, 'getInput').resolves('y')
      let actual = await ConfigHelper.cameraCheck(test_config, false)
      expect(actual[0].camera.enable).to.be.true
      expect(actual[1]).to.be.true
    })
    it('should return an array of an object with false, and "true"', async function() {
      let test_config = {
        camera: {
          enable: 'null'
        }
      }
      sinon.stub(ConfigHelper, 'getInput').resolves('n')
      let actual = await ConfigHelper.cameraCheck(test_config, false)
      expect(actual[0].camera.enable).to.be.false
      expect(actual[1]).to.be.true
    })
    it('should return an array of the passed object with "test", and "false"', async function() {
      let test_config = {
        camera: {
          enable: 'test'
        }
      }
      let actual = await ConfigHelper.cameraCheck(test_config, false)
      expect(actual[0].camera.enable).to.be.deep.equal('test')
      expect(actual[1]).to.be.false
    })
  })

  describe('configUpdate() tests', function() {
    it('should call writeFileSync', function() {
      let config = {}
      sinon.stub(fs, 'writeFileSync').callsFake()
      ConfigHelper.configUpdate(config)    
      sinon.assert.calledOnce(fs.writeFileSync)
    })
    it('should throw an error', function() {
      let config = {}
      sinon.stub(fs, 'writeFileSync').throws(new Error('ERROR!'))
      try {
        ConfigHelper.configUpdate(config)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('configChecker() tests', function() {
    it('should resolve true', async function() {
      let test_config = {}
      sinon.stub(ConfigHelper, 'boardCheck').resolves([test_config, true])
      sinon.stub(ConfigHelper, 'databaseCheck').resolves([test_config, true])
      sinon.stub(ConfigHelper, 'jwtCheck').resolves([test_config, true])
      sinon.stub(ConfigHelper, 'nodemailerCheck').resolves([test_config, true, false])
      sinon.stub(ConfigHelper, 'relayTogglePreventionCheck').resolves([test_config, true])
      sinon.stub(ConfigHelper, 'cameraCheck').resolves([test_config, true])
      sinon.stub(ConfigHelper, 'reloadConfig').resolves([test_config, true])
      sinon.stub(ConfigHelper, 'reloadWebData')
      sinon.stub(ConfigHelper, 'reloadBoardPinout')
      let actual = await ConfigHelper.configChecker(test_config, true)
      expect(actual).to.be.false
    })

    it('should resolve an error', async function() {
      let test_config = {}
      sinon.stub(ConfigHelper, 'boardCheck').throws(new Error("ERROR!"))
      await ConfigHelper.configChecker(test_config, true).then(() => {
        assert.fail()
      }).catch((e) => {
        assert.typeOf(e, 'Error')
      })
    })
  })
})