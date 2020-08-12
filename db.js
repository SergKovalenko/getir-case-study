const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true';
let db = null;
let currentClient = null;

// async function for connection to mongoDB
function connectDB(cb) {
    return MongoClient.connect(url, { useUnifiedTopology: true })
        .then((client) => {   
            console.log('MongoDB connected');
            currentClient = client;
            db = client.db();

            if (typeof cb === 'function') {
                cb();
            }
        })
        .catch((err) => console.log(err));
}

// get connected db inctance (used only after successful connection to mongoDB)
function getDB() {
    return db;
}

function closeConnection() {
    if (currentClient && typeof currentClient.close === 'function') {
        return currentClient.close();
    }
}

module.exports = { connectDB, getDB, closeConnection };
