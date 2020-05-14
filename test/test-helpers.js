function makeStitchesArray() {
      return [
    {   id: 1,
        stitch_name: 'back stitch',
        image_url: 'www.google.com',
        stitch_description: 'instructions to make the stitch'
    }, 
    {   id: 2,
        stitch_name: 'stem stitch',
        image_url: 'www.embroiderywebsite',
        stitch_description: 'instructions to make the stitch'
    },
    {   id: 3,
        stitch_name: 'french knot',
        image_url: 'www.google.com',
        stitch_description: 'instructions to make the stitch'
    }

]
}

function makeProjectsArray() {
    return [
        {   id: 1,
            project_name: 'lemon citrus',
            image_url: 'www.imageurl.com',
            project_description: 'description of the project',
            project_url: 'www.projecturl.com',
            stitches: 'back stitch, stem stitch, chain stitch'
        },
        {   id: 2,
            project_name: 'rainbow pattern',
            image_url: 'www.imageurl.com',
            project_description: 'description of the project',
            project_url: 'www.projecturl.com',
            stitches: 'french knot, stem stitch, chain stitch'
        },
        {   id: 3,
            project_name: 'clover flower',
            image_url: 'www.imageurl.com',
            project_description: 'description of the project',
            project_url: 'www.projecturl.com',
            stitches: 'satin stitch, bullion knot'
        }
    ]
}


module.exports = {
    makeProjectsArray,
    makeStitchesArray
}