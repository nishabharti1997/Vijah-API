const express = require('express');
const app = express();
const path = require('./Db/conn');
app.use(express.json());
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//All API Routes Goes here
require ("./Controllers/Users")(app);

app.listen(3004,()=>{
    console.log(`Server is Created`)
});
