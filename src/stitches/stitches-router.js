const express = require('express')
const StitchesService = require('./stitches-service')
const stitchesRouter = express.Router()
const jsonBodyParser = express.json()



stitchesRouter
.route('/')
.get((req, res) => {
    StitchesService.getAllStitches(req.app.get('db'))
    .then(stitches => {
       return res.status(200).json(stitches)
    })
})


module.exports = stitchesRouter;