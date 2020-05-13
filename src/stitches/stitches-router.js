const express = require('express')
const StitchesService = require('./stitches-service')
const stitchesRouter = express.Router()
const jsonBodyParser = express.json()



stitchesRouter
.route('/')
.get((req, res, next) => {
    if (req.query.stitch) {
        StitchesService.getByName(req.app.get('db'), req.query.stitch)
        .then(stitch=>{
            return res.status(200).json(stitch)
        })
    }
    StitchesService.getAllStitches(req.app.get('db'))
    .then(stitches => {
       return res.status(200).json(stitches)
    })
    .catch(next)
})


module.exports = stitchesRouter;