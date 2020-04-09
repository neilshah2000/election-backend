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

router.route('/election/:areaId')
  .get(electionCtrl.read)
  .put(electionCtrl.update)
  .delete(electionCtrl.remove);

router.param('areaId', electionCtrl.areaByID);

module.exports = router;