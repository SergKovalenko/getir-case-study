const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true';
let db = null;

function connectDB(cb) {
    return MongoClient.connect(url, { useUnifiedTopology: true })
        .then((client) => {   
            console.log('MongoDB connected');
            db = client.db();

            cb();
        })
        .catch((err) => console.log(err));
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
