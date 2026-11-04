const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')
const chai = require('chai')

describe('User', () => {
  
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })

  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    // it('avoid creating an existing user', (done)=> {
    //   // TODO create this test
    //   // Warning: the user already exists
    //   done()
    // })
  })




  describe('Get', () => {
    it('get a user by username', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      
      // On attend que Redis ait fini d'enregistrer l'utilisateur
      db.hmset(user.username, user, (err, res) => {
        chai.expect(err).to.be.equal(null)

        // Ensuite seulement, on appelle le contrôleur get
        userController.get(user.username, (err, result) => {
          chai.expect(err).to.be.equal(null)
          chai.expect(result.firstname).to.be.equal(user.firstname)
          chai.expect(result.lastname).to.be.equal(user.lastname)
          done()
        })
      })
    })

  it('cannot get a user when it does not exist', (done) => {
      userController.get('invaliduser', (err, result) => {
        chai.expect(err).to.not.be.equal(null)
        chai.expect(result).to.be.null // Modifié de .to.be.undefined à .to.be.null
        done()
      })
    })
  })
})

  // TODO Create test for the get method
 /* describe('Get', ()=> {
    
    it('get a user by username', (done) => {
    // 1. First, create a user to make this unit test independent from the others
    const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
    }
    userController.create(user, (err,result)=>{
      expect(err).to.be.equal(null)
     
    
   // 2. Then, check if the result of the get method is correct
   userController.get(user.name,(err,res)=>{
     expect(err).to.be.equal(null)
      expect(res).to.be.a('object')
      expect(res.firstname).to.be.equal(user.firstname)
      expect(res.lastname).to.be.equal(user.lastname)
      done()
    })
  })
})

  
   it('cannot get a user when it does not exist', (done) => {
     // Chech with any invalid user
     userController.get('nonexistentuser',(err,res)=>{
      expect(err).to.not.be.equal(null)
      expect(res).to.be.equal(null)
       done()
      })
   })
  
  })
})
  */
