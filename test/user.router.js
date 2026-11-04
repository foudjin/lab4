const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')

chai.use(chaiHttp)

describe('User REST API', () => {
  
    beforeEach(() => {
      // Clean DB before each test
      db.flushdb()
    })
    
    after(() => {
      app.close()
      db.quit()
    })

  describe('POST /user', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201)
          chai.expect(res.body.status).to.equal('success')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
    
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
  })

  describe('GET /user', () => {
    
    it('get an user by username', async () => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      
      // 1. Insertion de l'utilisateur dans Redis de manière synchrone (via Promesse)
      await new Promise((resolve, reject) => {
        db.hmset(user.username, user, (err, res) => {
          if (err) reject(err)
          else resolve(res)
        })
      })

      // 2. Requête GET sur l'API avec await
      const res = await chai.request(app).get(`/user/${user.username}`)
      
      chai.expect(res).to.have.status(200)
      chai.expect(res.body.status).to.equal('success')
      chai.expect(res.body.data.firstname).to.equal(user.firstname)
      chai.expect(res.body.data.lastname).to.equal(user.lastname)
      chai.expect(res).to.be.json
    })

    it('cannot get user when it does not exist', async () => {
      const res = await chai.request(app).get('/user/nonexistentuser')
      
      chai.expect(res).to.have.status(404)
      chai.expect(res.body.status).to.equal('error')
      chai.expect(res).to.be.json
    })

  })
})




  /*describe('GET /user', ()=> {
  it('get an user by username',(done) =>{
    const user ={
       username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
    }
    db.hmset(user.username,user,(err,result)=>{
      chai.expect(err).to.be.equal(null)
      chai.request(app)
      .get('/user/${user.username}')
      .then((res)=>{
        chai.expect(res).to.have.status(200)
        cahi.expect(res.body.status).to.equal(success)
        chai.expect(res.body.data.firstname).to.equal(user.firstname)
        chai.expect(res.body.data.lastname).to.equal(user.lastname)
        chai.expect(res).to.be.json
        done()
      })
      .catch((err)=>{
        throw err
      })
    })
  })
  it('cannot get user when it does not exist',(done)=>{
    chai.request(app)
    .get('/user/nonexistentuser')
    .then((res)=>{
      chai.expect(res).to.have.status(404)
      chai.expect(res.body.status).to.equal('error')
      chai.expect(res).to.be.json
      done()
    })
    .catch((err)=>{
      throw err
    })
  })
 })
})
 */
