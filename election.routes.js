var express = require('express');
var electionCtrl = require('./election.controller');

const router = express.Router();

router.route('/election')
    .get(electionCtrl.list)

router.route('/election/won')
    .get(electionCtrl.wonElection)

router.route('/election/ranking')
    .get(electionCtrl.electionRanking)

router.route('/election/lostDepositPairs')
    .get(electionCtrl.lostDepositPairs)

router.route('/election/partyLostDeposit/:party')
    .get(electionCtrl.partyLostDeposit)


router.route('/election/contested/:constId')
    .get(electionCtrl.findContested)
  
router.route('/election/winner/:areaId')
    .get(electionCtrl.findWinner)
router.param('areaId', electionCtrl.areaByID);


module.exports = router;