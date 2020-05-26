const express = require('express')
const StitchesService = require('./stitches-service')
const stitchesRouter = express.Router()
const requireAuth = require('../middleware/jwt-auth')



stitchesRouter
.route('/')
.all(requireAuth)
.get((req, res, next) => {
    const stitch = req.query.stitch
    // if there is a stitch query, get stitches by name of query
    if (stitch) {
        StitchesService.getByName(req.app.get('db'), stitch)
        .then(stitch=>{
            return res.status(200).json(stitch)
        })
    } else if (!stitch) {
    //if there is no stitch query, get all stitches
    StitchesService.getAllStitches(req.app.get('db'))
    .then(stitches => {
       return res.status(200).json(stitches)
    })
    .catch(next)
    }
})
stitchesRouter
.route('/:id')
.all(requireAuth)
.get((req, res, next) => {
    const id = req.params.id
    StitchesService.getById(req.app.get('db'), id)
    .then(stitch => {
        if(!stitch){
            //if stitch doesn't exist, send status 400
            return res.status(400).json({error:'stitch not found'})
        }
        return res.status(200).json(stitch)
    })
})


module.exports = stitchesRouter;