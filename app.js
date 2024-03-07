const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const {MONGOURI, LOGINTOKEN} = require("./config/keys")


mongoose.connect(MONGOURI)
mongoose.connection.on('connected', ()=>{

    console.log("connected to mongoDB")
})

mongoose.connection.on('error', (err)=>{
    console.log("error connecting, ", err)
})

require('./models/user') //Model here will ensure every thing is loaded at the starting of application.
require('./models/post') //can use your Schema

app.use(express.json());
app.use(require('./routes/authorisation')) 
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if (process.env.NODE_ENV === 'production') {
  const path = require('path');

  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}


app.listen(PORT, ()=>{
    console.log("listening at " ,PORT);
})

