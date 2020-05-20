
const SavedProjectsService = {
    getAllProjects(db, user_id){
        return db.from('saved_projects AS saved')
        .select('saved.user_id')
        .distinct('saved.id', 'project.project_name', 'project.project_description', 'project.image_url', 'project.stitches')
        .where('saved.user_id', user_id)
        .leftJoin('embroidery_users AS user', 'saved.user_id', 'user.id')
        .innerJoin('embroidery_projects AS project', 'project.id', 'saved.id')
    },
    saveProject(db, savedProject){
        return db.insert(savedProject).into('saved_projects')
    },
    getProjectById(db, user_id, id){
        return db.select('*').from('saved_projects').where('user_id', user_id).andWhere('id', id).first()
    },
    getProjectDetailsById(db, user_id, id){
        return db.from('saved_projects AS saved')
        .select('saved.user_id')
        .distinct('saved.id', 'project.project_name', 'project.project_description', 'project.image_url', 'project.stitches')
        .where('saved.user_id', user_id)
        .andWhere('project.id', id)
        .innerJoin('embroidery_users AS user', 'saved.user_id', 'user.id')
        .rightJoin('embroidery_projects AS project', 'project.id', 'saved.id')
    },
    deleteProject(db, user_id, project){
        return db.select('*').from('saved_projects').where('user_id', user_id).andWhere('id', project).del()
   }
}
module.exports = SavedProjectsService