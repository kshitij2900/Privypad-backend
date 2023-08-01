const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')

//new codes to set up server
const http = require('http');

connectToMongo();

const app = express()
const port = 3001
const server= http.createServer(app);
server.listen(port,()=>{console.log('server setup working '+port)});

app.use(cors())
app.use(express.json())
require('dotenv').config();

// Available Routes 
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

//create a user using: POST "/api/auth". Doesn't require auth
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.listen(port, () => {
    // console.log(`Example app listening at: http://localhost:${port}`)
// })