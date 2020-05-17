const SavedStitchesService = {
    getAllStitches(db, userId){
        console.log(userId)
        return db.from('saved_stitches AS saved')
        .select('saved.user_id', 'saved.stitch', 'stitch.stitch_name', 'stitch.stitch_description', 'stitch.image_url')
        .where('saved.user_id', userId)
        .leftJoin('embroidery_users AS user', 'saved.user_id', 'user.id' )
        .innerJoin('embroidery_stitches AS stitch', 'stitch.id', 'saved.stitch')
    },
    getById(){

    },
    saveStitch(){

    },
    deleteStitch(){
         
    }
}

module.exports = SavedStitchesService