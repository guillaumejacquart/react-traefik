var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var Datastore = require('nedb')
  , db = new Datastore({ filename: path.join(__dirname, '../cache.db'), autoload: true });

/* GET saved url listing. */
router.get('/url', function(req, res, next) {
    // The same rules apply when you want to only find one document
    db.findOne({ name: 'url' }, function (err, doc) {
        if(err){
            return res.status(500).json(err);
        }

        if (!doc) {
            return res.status(404).json({
                message: 'traefik url not provided'
            });
        }

        return res.json({
            status: 'ok',
            url: doc.value
        })
    });
});

/* GET users listing. */
router.put('/url', function(req, res, next) {
    var url = req.body.url;
    if (!url) {
        return res.status(400).json({
            message: 'Incorrect url'
        })
    }

    db.insert({name: 'url', value: url}, function (err, newDoc) {
        if(err){
            return res.status(500).json(err);
        }

        return res.json({
            status: 'ok',
            url: newDoc.value
        })
    });
});

/* GET providers info from traefik. */
router.get('/providers', function(req, res, next) {
    db.findOne({ name: 'url' }, function (err, doc) {
        if(err){
            return res.status(500).json(err);
        }

        if (!doc) {
            return res.status(404).json({
                message: 'traefik url not provided'
            });
        }

        var x = request(doc.value + '/api/providers', function(err, response) {
            if (err) {
                return res.status(500).json(err);
            }
        });
        req.pipe(x)
        x.pipe(res)
    });
});


module.exports = router;
