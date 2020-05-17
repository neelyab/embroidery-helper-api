const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')
const helpers = require('./test-helpers')


describe.only('GET Saved Projects endpoints', () => {
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
    beforeEach('seed embroidery projects', () => {
        const projects = helpers.makeProjectsArray()
        const savedProjects = helpers.makeSavedProjectsArray()
        return helpers.seedEmbroideryProjects(db, projects)
        .then(() => {
            return helpers.seedSavedProjects(db, savedProjects)
        })
    })
    afterEach( 'clean table', () => {
        return db.raw('TRUNCATE saved_projects, saved_stitches, embroidery_users, embroidery_stitches, embroidery_projects ')
    })
    context('GET saved projects', () => {
        const usersArray = helpers.makeUsersArray()
        const expectedArray =     [
            {
             image_url: "www.imageurl.com",
             project: 1,
             project_description: "description of the project",
             project_name: "lemon citrus",
             stitches: "back stitch, stem stitch, chain stitch",
             user_id: 1
            },
            {
             image_url: "www.imageurl.com",
             project: 2,
             project_description: "description of the project",
             project_name: "rainbow pattern",
             stitches: "french knot, stem stitch, chain stitch",
            user_id: 1
            }
          ]
   
        it('returns an array of saved projects by user id ', () => {
            return supertest(app)
            .get('/api/saved_projects')
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200)
            .then(res => {
                expect(res.body).to.have.lengthOf(2)
                expect(res.body).to.eql(expectedArray)
                expect(res.body[1].user_id).to.eql(1)
            })
        })
        it('returns an empty array of if user does not have any saved projects ', () => {
            return supertest(app)
            .get('/api/saved_projects')
            .set('Authorization', helpers.makeAuthHeader(usersArray[3]))
            .expect(200, [])
        })
        const id = 1
        const expectedSavedProject =  {
            image_url: "www.imageurl.com",
            project: 1,
            project_description: "description of the project",
            project_name: "lemon citrus",
            stitches: "back stitch, stem stitch, chain stitch",
            user_id: 1
           }
        it('returns a saved project by id', () => {
            return supertest(app)
            .get(`/api/saved_projects/${id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200)
            .then(res => {
                expect(res.body[0]).to.eql(expectedSavedProject)
            })
        })
        it('returns 404 not found when project is not saved', () => {
            return supertest(app)
            .get('/api/saved_projects/123')
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(404)
        })
    })
    context('POST saved projects', () => {
        const usersArray = helpers.makeUsersArray()
        const projectsArray = helpers.makeProjectsArray()
        const id = projectsArray[0].id
        const expectedResponse = [{
            image_url: "www.imageurl.com",
            project: 1,
            project_description: "description of the project",
            project_name: "lemon citrus",
            stitches: "back stitch, stem stitch, chain stitch",
            user_id: 1
           }]
        it('POST /api/saved_projects/:id saves project to saved_projects', () => {
            return supertest(app)
            .post( `/api/saved_projects/${id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(201, `Project with id: ${id} saved`)
            .then(() => {
                return supertest(app)
                .get(`/api/saved_projects/${id}`)
                .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
                .expect(200, expectedResponse)
            })
        })
        const nonexistentProjectId = 123
        it('POST /api/saved_projects/:id returns 404 when the project does not exist', () => {
            return supertest(app)
            .post(`/api/saved_projects/${nonexistentProjectId}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(404, {error: 'Project not found, unable to save.'})
        })
    })
    context('DELETE /api/saved_projects/:id', () => {
        const usersArray = helpers.makeUsersArray()
        const projectsArray = helpers.makeProjectsArray()
        it('DELETE /api/saved_projects/:id deletes project from saved_projects', () => {
            return supertest(app)
            .delete(`/api/saved_projects/${projectsArray[0].id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200, `Project with id: ${projectsArray[0].id} deleted`)
        })
        it('DELETE /api/saved_projects/:id that does not exist returns 404 ', () => {
            return supertest(app)
            .delete(`/api/saved_projects/123`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(404, {error: 'Project not found'})
        })
    })
    

})