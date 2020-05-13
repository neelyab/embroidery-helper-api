
const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')
const helpers = require('./test-helpers')

describe('Embroidery GET Stitches Endpoints', () => {
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })
  after('destroy connection', ()=>db.destroy())
  before('clean table', () => {
    db('embroidery_stitches').truncate()
  })
  afterEach('clean table', () => db.raw('TRUNCATE saved_projects, saved_stitches, embroidery_users, embroidery_stitches, embroidery_projects '))
  context('when no data is present in the tables', ()=>{
    it('GET / responds with 200 containing "Hello boilerplate!"', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'Hello boilerplate!')
    })
    it('GET /api/stitches returns 200 status and empty array when there is nothing int he database', () => {
      return supertest(app)
      .get('/api/stitches/')
      .expect(200, [])
    })
  })
  context('when data is present, GET /api/stitches', () => {
    before('put array of stitches in the table', ()=>{
      const stitches = helpers.makeStitchesArray();
     return db.into('embroidery_stitches').insert(stitches)
    })
    it('GET /api/stitches/ responds with 200 and array of stitches', ()=>{
      return supertest(app)
      .get('/api/stitches/')
      .expect(200)
      .expect(res=>{
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(3)
      })
    })
    it('GET /api/stitches/stitch=query returns stitches that contain query', () => {
      const stemStitch = 'stem stitch'
      return supertest(app)
      .get('/api/stitches?stitch=stemstitch')
      .expect(200)
      .expect(res=>{
        expect(res.body[0].stitch_name).to.equal(stemStitch)
      })
    } )
  })

})