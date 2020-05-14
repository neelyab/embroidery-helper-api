const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const stitchesRouter = require('./stitches/stitches-router')
const projectsRouter = require('./projects/projects-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({
    origin: CLIENT_ORIGIN
    })
)

app.use('/api/stitches', stitchesRouter)
app.use('/api/projects', projectsRouter)
// app.get('/', (req, res) => {
//      res.status(200).send('Hello boilerplate!')
//      })

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app