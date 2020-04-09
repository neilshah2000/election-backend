var _ = require('lodash');
var errorHandler = require('./dbErrorHandler');
var db = require('./db')


exports.create = (req, res, next) => {
    var collection = db.get().collection('all_results');
    collection.find({}).project({area: 1}).toArray((err, areas) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.status(200).json(areas);
    });
};

exports.list = (req, res) => {
    var mongo = db.get().db("test");
    var collection = mongo.collection('all_results');
    collection.find({}).project({area: 1}).toArray((err, areas) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.status(200).json(areas);
    });
};

// areaByID() called first
// req.area will contain a area
// type object from DB
exports.read = (req, res) => {
    return res.status(200).json(req.area);
};

// areaByID() called first
// req.area will contain a area
// type object from DB
exports.update = (req, res, next) => {
    // let originalJournal = req.journal;
    // let newJournal = _.extend(originalJournal, req.body);
    // newJournal.updated = Date.now();
    // newJournal.save((err, journal) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: errorHandler.getErrorMessage(err)
    //         });
    //     }
    //     res.json(journal);
    // });
};

// areaByID() called first
// req.area will contain a area
// type object from DB
exports.remove = (req, res, next) => {

};

/// helper //
exports.areaByID = (req, res, next, id) => {
    var collection = db.get().collection('all_results');
    collection.findOne({_id: id}, (err, area) => {
        if (err || !area) {
            return res.status('400').json({
                error: "Area not found"
            });
        }
        req.area = area;
        next();
    });
};