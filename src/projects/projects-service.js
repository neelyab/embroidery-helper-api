const ProjectsService = {
    getAllProjects(db){
        return db.select('*').from('embroidery_projects')
    },
    getProjectById(db, id){
        return db.select('*').from('embroidery_projects').where('id', id).first()
    },
    getProjectByStitch(db, stitch){
        return db('embroidery_projects').where('stitches', 'like', `%${stitch}%`)
    }
}

module.exports = ProjectsService