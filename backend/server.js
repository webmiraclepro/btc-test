const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

const uri = "mongodb+srv://root:root@cluster0.zoggfcf.mongodb.net/btc";
const client = new MongoClient(uri);
client.connect().then(() => console.log('MongoDB connected')).catch(console.log);

app.use(cors());
app.use(express.json());

app.post('/api/get-score', async (req, res) => {
    const { address } = req.body;
    const database = client.db("btc");
    const collection = database.collection("btc");

    let document;
    if (!address) {
        document = await collection.findOne({});
    } else {
        document = await collection.findOne({ address });
    }

    if (!document) {
        await collection.insertOne({address, score: 0});
        return res.json({score: 0});
    } else {
        return res.json({ score: document.score });
    }
});

app.post('/api/plus-score', async (req, res) => {
    const { address } = req.body;
    const database = client.db("btc");
    const collection = database.collection("btc");
    
    let document;
    if (!address) {
        document = await collection.findOne({});
    } else {
        document = await collection.findOne({ address });
    }

    if (document) {
        collection.updateOne({}, {
            $set: {
                score: document.score + 1
            }
        }).then(() => {
            return res.json({
                success: true
            });
        }).catch(() => {
            return res.json({
                success: false
            });
        });
    } else {
        return res.json({
            success: false
        });
    } 
});

app.post('/api/minus-score', async (req, res) => {
    const { address } = req.body;
    const database = client.db("btc");
    const collection = database.collection("btc");
    
    let document;
    if (!address) {
        document = await collection.findOne({});
    } else {
        document = await collection.findOne({ address });
    }

    if (document) {
        collection.updateOne({}, {
            $set: {
                score: document.score - 1
            }
        }).then(() => {
            return res.json({
                success: true
            });
        }).catch(() => {
            return res.json({
                success: false
            });
        });
    } else {
        return res.json({
            success: false
        });
    } 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});