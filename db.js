// const mongoose= require('mongoose');

// const mongoURI="mongodb://localhost:27017/"
// const connectToMongo=()=>{
//     mongoose.connect(mongoURI,()=>{
//         console.log("connected to mongo successfully");
//     })
// }
// module.exports=connectToMongo;
const mongoose = require('mongoose')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// const db=process.env.MONGODB_URI
const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        // mongoose.connect("mongodb://localhost:27017/inotebook") 
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
        console.log('Mongo connected')
        // console.log(process.env.MONGODB_URI)

    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;