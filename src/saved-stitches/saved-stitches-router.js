const express = require('express')
const requireAuth = require('../middleware/jwt-auth')
const SavedStitchesService = require('./saved-stitches-service')
const UsersService = require('../users/users-service')
const savedStitchesRouter = express.Router()

savedStitchesRouter
.route('/')
.all(requireAuth)
.get((req, res) => {
    console.log(req.user)
    const user = req.user.id
    console.log(user)
   return SavedStitchesService.getAllStitches(req.app.get('db'), user)
    .then(stitches => {
        return res.status(200).json(stitches)
       
    })
    // SavedStitchesService.getAllStitches(req.app.get('db'), id)

})

module.exports = savedStitchesRouter