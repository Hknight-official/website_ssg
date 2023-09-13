const express = require('express');
const {join} = require("path");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// routes
const apiRoute = require('./routes/api')

require('dotenv').config()
// console.log(process.env)

console.log("connecting mongodb...");
mongoose.connect(process.env.MONGODB_CONNECT, {
    useMongoClient: true,
});
console.log("connected mongodb success");

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json())

app.use('/api', apiRoute)

app.use(express.static(join(__dirname, 'build')));

app.get('/express_backend', (req, res) => { //Line 9
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get("*", (_, res) => res.sendFile("index.html", { root: "build" }));

app.listen(port, () => console.log(`Listening on port ${port}`));