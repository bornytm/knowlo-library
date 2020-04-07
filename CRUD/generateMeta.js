module.exports = function(linkPreview, db){

    linkPreview.get('/r/:uid', resourcePreview);   
    // linkPreview.get('/t/:uid', tagPreview);   //    TODO
    linkPreview.get('*', catchAll);   

    function catchAll(req,res) { 
        console.log(req.url)
        res.send(meta())
    }

    function resourcePreview(req,res) { 

        var cypher = "MATCH (resource:resource {uid:{uid}}) "
               + "WITH resource "
               + "OPTIONAL MATCH (resource)-[p:HAS_PROPERTY]->(prop:prop)-[plang:HAS_TRANSLATION ]->(ptrans:translation) "
               + "WHERE p.order=1 AND plang.languageCode IN [ {languageCode} , 'en' ] and prop.type='title' "
               + "RETURN resource.thumb as image, ptrans.value as title"

        db.query(cypher, {uid: req.params.uid, languageCode: req.query.languageCode || 'en'},function(err, result) {
            if(err){console.log(err)}
            if(result.length == 0){
                res.send(meta())
            } else {
                res.send(meta(result[0].title, undefined, result[0].image, 'https://www.knowlo.io' + req.url))
            }
        })
    }

    function meta(title, description, imageUrl, url){
        // defaults
        let ttitle = title || 'Knowlo Library'
        let tdescription = description || 'Knowlo is a learning community and platform for optimizing access to insight.'
        let timageUrl = imageUrl || 'https://i1.wp.com/knowlo.org/wp-content/uploads/2020/02/size-time-tight.png' // curriculum image hosted on wordpress site
        let turl = url || 'https://www.knowlo.io'

        let metaTemplate = `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>${ttitle} - Knowlo</title>
                <!-- Facebook meta -->
                <meta name='og:title' content='${ttitle} - Knowlo'>
                <meta name='og:description' content='${tdescription}'>
                <meta name='og:image' content='${timagUurl}'>
                <meta name='og:url' content='${turl}'>
                <meta name='og:type' content='website'>
                <!-- Twitter meta -->
                <meta name='twitter:card' content='summary_large_image'>
                <meta name='twitter:title' content='${ttitle} - Knowlo'>
                <meta name='twitter:description' content='${tdescription}'>
                <meta name='twitter:image' content='${timagUurl}'>
                <!-- Google / Search Engine meta -->
                <meta name='name' content='${ttitle} - Knowlo'>
                <meta name='description' content='${tdescription}'>
                <meta name='image' content='${timagUurl}'>
            </head>
            <body>
                <h1>${ttitle} - Knowlo</h1>
            </body>
        </html>
        `
        return metaTemplate
    }
    
}