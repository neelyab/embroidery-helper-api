const express = require('express')
const StitchesService = require('./stitches-service')
const stitchesRouter = express.Router()




stitchesRouter
.route('/')
.get((req, res, next) => {
    const stitch = req.query.stitch
    console.log(stitch)
    if (stitch) {
        StitchesService.getByName(req.app.get('db'), stitch)
        .then(stitch=>{
            return res.status(200).json(stitch)
        })
    } else if (!stitch) {
    StitchesService.getAllStitches(req.app.get('db'))
    .then(stitches => {
       return res.status(200).json(stitches)
    })
    .catch(next)
    }
})
stitchesRouter
.route('/:id')
.get((req, res, next) => {
    const id = req.params.id
    StitchesService.getById(req.app.get('db'), id)
    .then(stitch => {
        if(!stitch){
            return res.status(400).json({error:'stitch not found'})
        }
        return res.status(200).json(stitch)
    })
})


module.exports = stitchesRouter;