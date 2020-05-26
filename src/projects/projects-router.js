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
        // if stitch query is present, get projects matching the query
        ProjectsService.getProjectByStitch(req.app.get('db'), stitch)
        .then(projects=>{
            return res.status(200).json(projects).end()
        })
    } else {
        // if stitch is not present, get all projects
    ProjectsService.getAllProjects(req.app.get('db'))
    .then(projects=>{
        return res.status(200).json(projects)
    })
    }
})
// get project by id
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