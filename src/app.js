const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const stitchesRouter = require('./stitches/stitches-router')
const projectsRouter = require('./projects/projects-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const savedStitchesRouter = require('./saved-stitches/saved-stitches-router')
const savedProjectsRouter = require('./saved-projects/saved-projects-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors({
    origin: CLIENT_ORIGIN
}));
app.use(helmet())

app.use('/api/users', usersRouter)
app.use('/api/auth/login', authRouter)
app.use('/api/stitches', stitchesRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/saved_stitches', savedStitchesRouter)
app.use('/api/saved_projects', savedProjectsRouter)


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app