const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json()); //undefined

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.yfcuz4b.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db('N231-1')
        const userCollection = database.collection('Users')
        const orderCollection = database.collection('Order')

        // const users = { name: 'text', email: 'text@gmail.com' }
        // const send = await userCollection.insertOne(users)
        // console.log(send);

        // user get
        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
            console.log(users);
        })


        // specific user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        // user and via post
        app.post('/user', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
            console.log(result);
        })

        // user update
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }

            const user = req.body
            const options = { upsert: true }
            const updateUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    phone: user.phone,
                    email: user.email,
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, options)
            res.send(result)


        })



        // Delete
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
            console.log(query);
        })



    }
    finally {


        // await client.close();
    }
}
run().catch(error => console.log(error));



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})