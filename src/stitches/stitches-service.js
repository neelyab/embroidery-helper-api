
const StitchesService = {
    getAllStitches(db){
        return db.select('*').from('embroidery_stitches')
    },
    getByName(db, stitch){
        return db('embroidery_stitches').where('stitch_name', 'like', `%${stitch}%`)
    },
    getById(db, id){
        return db.from('embroidery_stitches').select('*').where('id', id).first()
    }
}

module.exports = StitchesService;