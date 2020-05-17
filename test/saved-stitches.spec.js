const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')
const helpers = require('./test-helpers')


describe.only('GET Embroidery Projects endpoints', () => {
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
            stitch: 1,
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

    })

})