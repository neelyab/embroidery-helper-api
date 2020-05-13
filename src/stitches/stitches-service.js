const StitchesService = {
    getAllStitches(db){
        return db.select('*').from('embroidery_stitches')
    },
    getByName(db, stitch){
        return db('embroidery_stitches').where('stitch_name', 'like', `%${stitch}%`)
    }
}

module.exports = StitchesService;