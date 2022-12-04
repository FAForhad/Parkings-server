const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c3txqlb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const parkingCollection = client.db('parkings').collection('service')
        const spotsCollection = client.db('parkings').collection('spots')
        //create
        app.post('/service', async (req, res) => {
            const user = req.body;
            const result = await parkingCollection.insertOne(user);
            res.send(result)
        });

        app.get('/service', async (req, res) => {
            const quary = {}
            const cursor = parkingCollection.find(quary);
            const users = await cursor.toArray();
            res.send(users)
        })

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const result = await parkingCollection.deleteOne(quary)
            res.send(result);

        })

        // userUpdate

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const user = await parkingCollection.findOne(quary);
            res.send(user)
        })

        app.post('/service/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const quary = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: user.email,
                    photo: user.photo,
                    name: user.name
                }
            }
            const result = await parkingCollection.updateOne(quary, updateDoc, options);
            res.send(result)
        })




        app.get('/spots', async (req, res) => {
            const quary = {};
            const cursor = spotsCollection.find(quary);
            const spots = await cursor.toArray();
            res.send(spots);
        })


        app.get('/areaSpots', async (req, res) => {
            const quary = {};
            const cursor = spotsCollection.find(quary);
            const spots = await cursor.limit(6).toArray();
            res.send(spots);
        })
    }
    finally {

    }
}

run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('App is runing')
})

// own 
// 6OvixEOU0FNsnwet


app.listen(port, () => {
    console.log(`app is running in port ${port}`)
})