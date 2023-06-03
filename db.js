const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
// const mongoURI = "mongodb://localhost:27017/mimit_base";
const mongoURI = `${process.env.MONGO_URI}`;

const connectToMongo = () => {
    try {
        mongoose.connect(mongoURI, () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('Database connection established.');
            }
        })
    } catch (error) {
        console.log("Connection error: " + error);
    }
}

module.exports = connectToMongo;