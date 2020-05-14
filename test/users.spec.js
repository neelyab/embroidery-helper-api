const helpers = require('./test-helpers')
const app = require('../src/app')
const knex = require('knex')
const {expect} = require('chai')

const usersArray = helpers.makeUsersArray()


describe.only('user endpoints', () => {
    let db
    before('make knex instance', () =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })
    before('clean tables', () => {
        db('embroidery_users').truncate()
    })
    afterEach('clean up tables', () => {
        db.raw('TRUNCATE saved_projects, saved_stitches, embroidery_users, embroidery_stitches, embroidery_projects ')
    })
    context('POST /users missing fields returns status 400', () => {
            const requiredFields = ['username', 'user_password', 'first_name']
            requiredFields.forEach(field => {
                const registerAttempt = {
                username: 'test user_name',
                user_password: 'test password',
                first_name: 'test full_name',
              } 
              it(`POST /users returns 400 status when missing ${field} in request body`, () => {
                delete registerAttempt[field];
                return supertest(app)
                .post('/api/users/')
                .send(registerAttempt)
                .expect(400)
            })
        })
    })
    context('POST /users with invalid password requirements returns 400', () => {
        const registerAttempt =  {
        username: 'test user_name',
        user_password: 'test password',
        first_name: 'test full_name',
        }
        it('returns 404 password must contain...', () => {
            return supertest(app)
            .post('/api/users/')
            .send(registerAttempt)
            .expect(400, {error:'Password must contain one upper case, lower case, number and special character'})
        })
    })
    context('POST /users returns 400 when the username already exists', () => {
        const duplicateUser = {
            username: 'test-user-1',
            user_password: 'Password1!',
            first_name: 'Test',
        }  
        before('insert test users into db', () => {
            helpers.seedUsers(db, usersArray)
        })
        it('returns 400 username already taken', () => {  
            return supertest(app)
            .post('/api/users')
            .send(duplicateUser)
            .expect(400, {error: 'Username already taken'})
        })
    })
    context('POST /users posts new user into database and returns user information in json response', () => {
        const newUser = {
            username: 'new user',
            user_password: 'Password!1',
            first_name: 'amanda'
        }
        it('posts new user into db', () => {
            return supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
        })
    })
})