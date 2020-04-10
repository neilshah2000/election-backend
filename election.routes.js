var express = require('express');
var electionCtrl = require('./election.controller');

const router = express.Router();

router.route('test').get((req, res) => {
    return res.json({test: 'test'});
});

router.route('').get((req, res) => {
    return res.json({test: ''});
});

router.route('/election')
    .get(electionCtrl.list)
    .post(electionCtrl.create);

router.route('/election/won')
    .get(electionCtrl.wonElection)

router.route('/election/ranking')
    .get(electionCtrl.electionRanking)

router.route('/election/lostDepositPairs')
    .get(electionCtrl.lostDepositPairs)

router.route('/election/partyLostDeposit/:party')
    .get(electionCtrl.partyLostDeposit)

router.route('/election/:areaId')
    .get(electionCtrl.read)
    .put(electionCtrl.update)
    .delete(electionCtrl.remove);

router.route('/election/contested/:constId')
    .get(electionCtrl.findContested)
  
router.route('/election/winner/:areaId')
    .get(electionCtrl.findWinner)
router.param('areaId', electionCtrl.areaByID);


module.exports = router;