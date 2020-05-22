const express = require('express')
const ProjectsService = require('./projects-service')
const projectsRouter = express.Router()
const requireAuth = require('../middleware/jwt-auth')

projectsRouter
.route('/')
.all(requireAuth)
.get((req, res, next) => {
    const stitch = req.query.stitch
    if(stitch){
        console.log(stitch)
        ProjectsService.getProjectByStitch(req.app.get('db'), stitch)
        .then(projects=>{
            console.log(projects)
            return res.status(200).json(projects)
        })
    } else {
    ProjectsService.getAllProjects(req.app.get('db'))
    .then(projects=>{
        return res.status(200).json(projects)
    })
    }
})

projectsRouter
.route('/:id')
.all(requireAuth)
.get((req, res) => {
    const id = req.params.id
    ProjectsService.getProjectById(req.app.get('db'), id)
    .then(stitch=> {
        if (!stitch) {
            return res.status(400).json({error: 'project not found'})
        }
        return res.status(200).json(stitch)
    })
})


module.exports = projectsRouter