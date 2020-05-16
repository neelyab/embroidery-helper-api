const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')
const helpers = require('./test-helpers')

const testUsers = helpers.makeUsersArray()
describe('GET Embroidery Projects endpoints', () => {
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
     return db.raw('TRUNCATE saved_projects, saved_stitches, embroidery_users, embroidery_stitches, embroidery_projects ')
    })
    beforeEach('seed users', () => {
      const usersArray = helpers.makeUsersArray()
     return helpers.seedUsers(db, usersArray)
  })
    afterEach('clean table', () => db.raw('TRUNCATE saved_projects, saved_stitches, embroidery_users, embroidery_stitches, embroidery_projects '))
    context('when no data is present in the tables', ()=>{
      const usersArray = helpers.makeUsersArray()
      it('GET /api/projects returns 200 status and empty array when there is nothing in the database', () => {
        return supertest(app)
        .get('/api/projects/')
        .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
        .expect(200, [])
      })
      it('GET /api/projects/:id returns 400 not found when no project id exists', () => {
          const id = 123
          return supertest(app)
          .get(`/api/projects/${id}`)
          .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
          .expect(400, {error: 'project not found'})
      })
    })
    context('when data is present in tables', () => {
      const usersArray = helpers.makeUsersArray()
        beforeEach('put array of stitches in the table', ()=>{
            const projects = helpers.makeProjectsArray();
           return db.into('embroidery_projects').insert(projects)
          })
        it('GET /api/projects/ returns an array of projects and 200 status', () => {
            return supertest(app)
            .get('/api/projects/')
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200)
            .expect(res => {
                expect(res.body).to.have.lengthOf(3)
            })
        })
        it('GET /api/projects/:id returns project with the id ', () => {
            const id = 1
            const projectsArray = helpers.makeProjectsArray()

            return supertest(app)
            .get(`/api/projects/${id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200)
            .expect(res => expect(res.body).to.eql(projectsArray[0]))
        })
    })
})