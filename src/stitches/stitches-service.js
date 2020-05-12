const StitchesService = {
    getAllStitches(db){
        return db.select('*').from('embroidery_stitches')
    }
}

module.exports = StitchesService;