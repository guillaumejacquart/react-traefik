var express = require('express');
var router = express.Router();
var request = require('request');

var levelup = require('level')

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./data')

/* GET saved url listing. */
router.get('/url', function(req, res, next) {
    db.get('url', function(err, value) {
        if (err) return res.status(404).json(err) // some kind of I/O error

        return res.json({
            status: 'ok',
            url: value
        })
    })
});

/* GET users listing. */
router.put('/url', function(req, res, next) {
    var url = req.body.url;
    if(!url){
        return res.status(400).json({
            message: 'Incorrect url'
        })
    }

    db.put('url', url, function(err) {
        if (err) return res.status(500).json(err) // some kind of I/O error

        return res.json({
            status: 'ok',
            url: url
        })
    })
});

/* GET providers info from traefik. */
router.get('/providers', function(req, res, next) {
    db.get('url', function(err, value) {
        if (err) {
            if (err.notFound) {
                // handle a 'NotFoundError' here
                return res.status(404).json({
                    message: 'traefik url not provided'
                })
            }
            // I/O or other error, pass it up the callback chain
            return res.status(500).json(err);
        }
        
        var x = request(value + '/api/providers', function(err, response){
            if(err){
                return res.status(500).json(err);
            }
        });
        req.pipe(x)
        x.pipe(res)
    })
});

module.exports = router;
