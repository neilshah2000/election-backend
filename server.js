var path = require('path');
var express = require('express');
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var cors = require('cors');
var helmet = require('helmet');
var electionRoutes = require('./election.routes');
var db = require('./db');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/api', electionRoutes);


const CURRENT_WORKING_DIR = process.cwd();
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

// let all routing be handled by client side
// app.get('*', (req, res) => {
//     res.status(200).send(template());
// });


/**
 *  Mongo Stuff
 */

// Connection URL
const url = 'mongodb://root:example@34.204.87.229:27017/?authSource=admin';
let port = process.env.PORT || 3000;

db.connect(url, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        app.listen(port, function(err) {
            if (err) {
                console.log(err);
            }
            console.info('Server started on port %s.', port);
        });
    }
})

// (async function(){
//     try {
//         let client = await MongoClient.connect(url)
//         const db = client.db("test");
//         var cursor = db.collection('all_results').find({}).project({area: 1});
//         cursor.forEach(iterateFunc, errorFunc);
//     } catch (err) {
//         console.error(err)
//     }
// })();


// function iterateFunc(doc) {
//     console.log(JSON.stringify(doc, null, 4));
// }
 
//  function errorFunc(error) {
//     console.log(error);
// }