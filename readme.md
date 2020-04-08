import: ```mongoimport --uri "mongodb://root:example@34.204.87.229:27017/?authSource=admin" --drop --collection all_results --file electiondb.json```

run ```node --inspect-brk election/connection.js```
