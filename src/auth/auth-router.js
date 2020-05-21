const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
.post('/', jsonBodyParser, (req, res) => {
    const {username, password} = req.body
    const loginUser = {
        username: username.toLowerCase(),
        password}
    for (const [key, value] of Object.entries(loginUser))
        if (value == null)
        return res.status(400).json({error:`Missing ${key}`})
    AuthService.getUserWithUserName(req.app.get('db'), loginUser.username)
    .then(dbUser => {
        if (!dbUser)
            return res.status(400).json({error: 'Incorrect username or password'})
        AuthService.comparePasswords(loginUser.password, dbUser.user_password)
        .then(compareMatch => {
            if(!compareMatch)
            return res.status(400).json({error: 'Invalid username or password'})
            const sub = dbUser.username
            const payload = {user_id: dbUser.id}
            res.send({
                authToken: AuthService.createJwt(sub, payload),
            })
        })
    })
})

    module.exports = authRouter