const express = require('express')
const requireAuth = require('../middleware/jwt-auth')
const SavedProjectsService = require('./saved-projects-service')
const ProjectsService = require('../projects/projects-service')
const savedProjectsRouter = express.Router()


savedProjectsRouter
.route('/')
.all(requireAuth)
.get((req, res) => {
    const user = req.user.id
    return SavedProjectsService.getAllProjects(req.app.get('db'), user)
    .then(projects => {
        return res.status(200).json(projects)
    })
})

savedProjectsRouter
.route('/:id')
.all(requireAuth)
.get(checkProjectIsSaved, (req, res) => {
    const user_id = req.user
    const project = req.project.project
    SavedProjectsService.getProjectDetailsById(req.app.get('db'), user_id, project)
    .then(project => {
        res.status(200).json(project)
    })
})
.post(checkProjectExists, (req, res) => {
    const user_id = req.user
    const {id} = req.params
    const project = id
    const savedProject = {
        user_id: user_id,
        project: project
    }
    console.log(savedProject)
    SavedProjectsService.saveProject(req.app.get('db'), savedProject)
    .then(() => {
        return res.status(201).send(`Project with id: ${project} saved`)
    })
})
.delete(checkProjectIsSaved, (req, res) => {
    const user_id = req.user
    const project = req.project.project
    SavedProjectsService.deleteProject(req.app.get('db'), user_id, project)
    .then(()=>{
        return res.status(200).send(`Project with id: ${project} deleted`)
    })
})

async function checkProjectIsSaved(req, res, next){   
    try {
            const user_id = req.user.id
            const {id} = req.params
            const project = await SavedProjectsService.getProjectById(req.app.get('db'), user_id, id)
        if(!project){
            return res.status(404).json({error: 'Project not found'})
        }
        req.user = user_id
        req.project = project
        next()
    }
    catch(error){
        next(error)
    }

}  
async function checkProjectExists(req, res, next){
    try{
        const {id} = req.params
        const project = await ProjectsService.getProjectById(req.app.get('db'), id)
        if(!project){
            return res.status(404).json({error: 'Project not found, unable to save.'})
        }
        req.user = req.user.id
        req.project = project
        next()
    }
    catch(error){
        next(error)
    }
}
module.exports = savedProjectsRouter