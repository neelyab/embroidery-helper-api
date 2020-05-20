const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')
const helpers = require('./test-helpers')


describe('GET Saved Stitches endpoints', () => {
    let db
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
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
    beforeEach('seed embroidery stitches', () => {
        const stitches = helpers.makeStitchesArray()
        const embStitches = helpers.makeSavedStitchesArray()
        return helpers.seedEmbroideryStitches(db, stitches)
        .then(() => {
            return helpers.seedSavedStitches(db, embStitches)
        })
    })
    afterEach( 'clean table', () => {
        return db.raw('TRUNCATE saved_projects, saved_stitches, embroidery_users, embroidery_stitches, embroidery_projects ')
    })
    context('returns saved stitches of user', () => {
        const usersArray = helpers.makeUsersArray()
        const expectedSavedStitch = {
            user_id: 1,
            id: 1,
            stitch_name: "back stitch",
            stitch_description: "instructions to make the stitch",
            image_url: "www.google.com"
        }
        it('returns 200 and array of saved stitches', () => {
            return supertest(app)
            .get('/api/saved_stitches')
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200)
            .then(res => {
                expect(res.body).to.have.lengthOf(2)
                expect(res.body[0]).to.eql(expectedSavedStitch)
                expect(res.body[1].user_id).to.eql(1)
            })
        })
        it('returns 200 and an empty array when user has no saved stitches', () => {
            return supertest(app)
            .get('/api/saved_stitches')
            .set('Authorization', helpers.makeAuthHeader(usersArray[1]))
            .expect(200, [])
        })
        const id = 1
        it('returns a saved stitch by id', () => {
            return supertest(app)
            .get(`/api/saved_stitches/${id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200)
            .then(res => {
                expect(res.body[0]).to.eql(expectedSavedStitch)
            })
        })
        it('returns 404 not found when stitch is not saved', () => {
            return supertest(app)
            .get('/api/saved_stitches/123')
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(404)
        })

    })
    context('POST saved stitches', () => {
        const usersArray = helpers.makeUsersArray()
        const stitchesArray = helpers.makeStitchesArray()
        const id = stitchesArray[0].id
        const expectedResponse = [{
            user_id:1,
            id:1,
            stitch_name:"back stitch",
            stitch_description:"instructions to make the stitch",
            image_url:"www.google.com"
        }]
        it('POST /api/saved_stitches/:id saves stitch to saved_stitches', () => {
            return supertest(app)
            .post(`/api/saved_stitches/${id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(201, `Stitch with id: ${id} saved`)
            .then(() => {
                return supertest(app)
                .get(`/api/saved_stitches/${id}`)
                .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
                .expect(200, expectedResponse)
            })
        })
        const nonexistentStitchId = 123
        it('POST /api/saved_stitchs/:id returns 404 when the stitch id does not exist', () => {
            return supertest(app)
            .post(`/api/saved_stitches/${nonexistentStitchId}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(404, {error: 'Stitch not found, unable to save.'})
        })
    })
    context('DELETE /api/saved_stitches', () => {
        const usersArray = helpers.makeUsersArray()
        const stitchesArray = helpers.makeStitchesArray()
        it('DELETE /api/saved_stitches/:id deletes stitch from saved_stitches', () => {
            return supertest(app)
            .delete(`/api/saved_stitches/${stitchesArray[0].id}`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(200, `Stitch with id: ${stitchesArray[0].id} deleted`)
        })
        it('DELETE /api/saved_stitches/:id that does not exist returns 404 ', () => {
            return supertest(app)
            .delete(`/api/saved_stitches/123`)
            .set('Authorization', helpers.makeAuthHeader(usersArray[0]))
            .expect(404, {error: 'Stitch not found'})
        })
    })

})