var _ = require('lodash');
var errorHandler = require('./dbErrorHandler');
var db = require('./db')
var ObjectID = require('mongodb').ObjectID;


getDatabase = () => {
    var mongo = db.get().db("test");
    return mongo.collection('all_results');
}

exports.create = (req, res, next) => {
    var collection = getDatabase();
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
    var collection = getDatabase();
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

// areaByID() called first
// req.area will contain a area
// type object from DB
exports.findWinner = (req, res, next) => {
    const constituency = req.area;
    const winner = _.maxBy(constituency.ukresults, (res) => { return res.ukvotes}); // TODO should we use this??
    return res.status(200).json(winner);
};

// areaByID() called first
// req.area will contain a area
// type object from DB
exports.findContested = async (req, res) => {
    var collection = getDatabase();
    id = new ObjectID(req.params.constId);
    var cont = await collection.aggregate([{
            $match: {
                _id: id,
            },
        },{
            $unwind: '$ukresults',
        },{
            $project: {
                '_id':0,
                'ukresults.party':1,
                'ukresults.ukvotes':1,
            },
        }, {
            $sort: {
                'ukresults.ukvotes':-1,
            }
        }
    ]).toArray();
    const pretty = cont.map((count) => {
        return {
            party: count.ukresults.party,
            ukvotes: count.ukresults.ukvotes
        }
    })
    return res.status(200).json(pretty);
};

exports.wonElection = async (req, res) => {
    var collection = getDatabase();
    var cont = await collection.aggregate([{
            $project: { // https://stackoverflow.com/questions/36824601/mongodb-query-to-get-max-of-field-inside-array
                constWinner: {
                    $arrayElemAt: [
                        '$ukresults',
                        {
                            $indexOfArray: [
                                '$ukresults.ukvotes',
                                { $max: '$ukresults.ukvotes'}
                            ]
                        }
                    ]
                }
            }
        }, {
            $group: {
                _id: '$constWinner.party',
                count: { $sum: 1 },
            }
        }, {
            $sort: {
                count: -1
            }
        }, {
            $limit: 1
        }
    ]).toArray();
    const pretty = {
        winner: cont[0]._id,
        constituencyCount: cont[0].count
    }
    return res.status(200).json(pretty);
};

exports.electionRanking = async (req, res) => {
    var collection = getDatabase();
    var cont = await collection.aggregate([{
            $project: { // https://stackoverflow.com/questions/36824601/mongodb-query-to-get-max-of-field-inside-array
                constWinner: {
                    $arrayElemAt: [
                        '$ukresults',
                        {
                            $indexOfArray: [
                                '$ukresults.ukvotes',
                                { $max: '$ukresults.ukvotes'}
                            ]
                        }
                    ]
                }
            }
        }, {
            $group: {
                _id: '$constWinner.party',
                count: { $sum: 1 },
            }
        }, {
            $sort: {
                count: -1
            }
        }
    ]).toArray();
    const pretty = cont.map((result) => {
        return {
            party: result._id,
            constituencyCount: result.count
        };
    });
    return res.status(200).json(pretty);
};

exports.lostDepositPairs = async (req, res) => {
    var collection = getDatabase();
    var cont = await collection.aggregate([{
            $addFields: {
                votesCast: {
                    $sum: '$ukresults.ukvotes'
                }
            },
        }, {
            $unwind: '$ukresults',
        }, {
            $addFields: {
                percentVote: {
                    $divide: ['$ukresults.ukvotes', '$votesCast']
                }
            }
        }, {
            $match: {
                percentVote: { $lt: 0.05 }
            }
        }, {
            $sort: {
                'area': 1,
            }
        }
    ]).toArray();
    const pretty = cont.map((ld) => {
        return {
            constituency: ld.area,
            lostDepositParty: ld.ukresults.party
        }
    });
    return res.status(200).json(pretty);
};

exports.partyLostDeposit = async (req, res) => {
    var collection = getDatabase();
    const party = req.params.party;
    var cont = await collection.aggregate([{
            $addFields: {
                votesCast: {
                    $sum: '$ukresults.ukvotes'
                }
            },
        }, {
            $unwind: '$ukresults',
        }, {
            $match: {
                'ukresults.party': party
            }
        }, {
            $addFields: {
                percentVote: {
                    $divide: ['$ukresults.ukvotes', '$votesCast']
                }
            }
        }, {
            $match: {
                percentVote: { $lt: 0.05 }
            }
        }, {
            $sort: {
                'area': 1,
            }
        }, {
            $project: {
                area: 1
            }
        }
    ]).toArray();

    return res.status(200).json(cont);
};

/// helper //
exports.areaByID = (req, res, next, areaId) => {
    var collection = getDatabase();
    id = new ObjectID(areaId);
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
