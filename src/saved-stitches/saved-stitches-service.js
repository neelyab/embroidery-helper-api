const SavedStitchesService = {
    getAllStitches(db, user_id){
        return db.from('saved_stitches AS saved')
        .select('saved.user_id')
        .distinct('saved.stitch', 'stitch.stitch_name', 'stitch.stitch_description', 'stitch.image_url')
        .where('saved.user_id', user_id)
        .leftJoin('embroidery_users AS user', 'saved.user_id', 'user.id' )
        .innerJoin('embroidery_stitches AS stitch', 'stitch.id', 'saved.stitch')
    },
    saveStitch(db, savedStitch){
        return db.into('saved_stitches').insert(savedStitch)
    },
    getStitchById(db, user_id, id){
        return db.select('*').from('saved_stitches').where('user_id', user_id).andWhere('stitch', id).first()
    },
    getStitchDetailsById(db, user_id, id){
        return db.from('saved_stitches AS saved')
        .select('saved.user_id')
        .distinct('saved.stitch', 'stitch.stitch_name', 'stitch.stitch_description', 'stitch.image_url')
        .where('saved.user_id', user_id)
        .andWhere('stitch.id', id)
        .innerJoin('embroidery_users AS user', 'saved.user_id', 'user.id')
        .rightJoin('embroidery_stitches AS stitch', 'stitch.id', 'saved.stitch')
    },
    deleteStitch(db, user_id, stitch){
         return db.select('*').from('saved_stitches').where('user_id', user_id).andWhere('stitch', stitch).del()
    }
}

module.exports = SavedStitchesService