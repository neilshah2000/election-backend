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

app.use('/', express.static(path.join(CURRENT_WORKING_DIR, 'build')));

app.get('/*', (req, res) => {
    const indexFilePath = path.join(CURRENT_WORKING_DIR, 'build/index.html')
    console.log('getting file: ' + indexFilePath);
    res.sendFile(indexFilePath);
})

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
