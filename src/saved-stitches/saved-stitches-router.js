const express = require('express')
const requireAuth = require('../middleware/jwt-auth')
const SavedStitchesService = require('./saved-stitches-service')
const savedStitchesRouter = express.Router()

savedStitchesRouter
.route('/')
.all(requireAuth)
.get((req, res) => {
    const user = req.user.id
    console.log(user)
   return SavedStitchesService.getAllStitches(req.app.get('db'), user)
    .then(stitches => {
        return res.status(200).json(stitches)
       
    })
})

savedStitchesRouter
.route('/:id')
.all(requireAuth)
.post((req, res) => {
    const user_id = req.user.id
    const {id} = req.params
    const stitch = id
    const savedStitch = {
        user_id,
        stitch
    }
    SavedStitchesService.saveStitch(req.app.get('db'), savedStitch)
    .then(() => {
        return res.status(201).send(`stitch ${stitch} saved`)
    })
})
.delete((req, res) => {
    const user_id = req.user.id
    const {id} = req.params
    const stitch = id
    SavedStitchesService.deleteStitch(req.app.get('db'), user_id, stitch)
    .then(()=>{
        return res.status(200).send(`Stitch ${stitch} deleted`)
    })
})

module.exports = savedStitchesRouter