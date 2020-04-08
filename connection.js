const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://root:example@34.204.87.229:27017/?authSource=admin';

(async function(){
    try {
        let client = await MongoClient.connect(url)
        const db = client.db("test");
        var cursor = db.collection('all_results').find({}).project({area: 1});
        cursor.forEach(iterateFunc, errorFunc);
    } catch (err) {
        console.error(err)
    }
})();


function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
}
 
 function errorFunc(error) {
    console.log(error);
}