var express = require('express');
var router = express.Router();
var request = require('request');
var dirty = require('dirty');
var path = require('path');
var db = dirty(path.join(__dirname, '../cache.db'));

/* GET saved url listing. */
router.get('/url', function(req, res, next) {
    var url = db.get('url')
    if (!url) return res.status(404) // some kind of I/O error

    return res.json({
        status: 'ok',
        url: url
    })
});

/* GET users listing. */
router.put('/url', function(req, res, next) {
    var url = req.body.url;
    if (!url) {
        return res.status(400).json({
            message: 'Incorrect url'
        })
    }

    db.set('url', url, function() {
        return res.json({
            status: 'ok',
            url: url
        })
    })
});

/* GET providers info from traefik. */
router.get('/providers', function(req, res, next) {
    var url = db.get('url');
    if (!url) {
        // handle a 'NotFoundError' here
        return res.status(404).json({
            message: 'traefik url not provided'
        })
    }

    var x = request(url + '/api/providers', function(err, response) {
        if (err) {
            return res.status(500).json(err);
        }
    });
    req.pipe(x)
    x.pipe(res)
});


module.exports = router;
