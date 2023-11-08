require('dotenv').config();
const express = require('express');
const cors = require('cors');
// var jwt = require('jsonwebtoken');
const app = express();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

const port = process.env.PORT || 5001




app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn0nmqv.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const JobCollection = client.db('TalendBazaar').collection('JobItem');
        const MyBidsCollection = client.db('TalendBazaar').collection('MyBids');

        // post data of add job info add on database
        app.post('/addjob', async (req, res) => {
            const jobData = req.body;
            const result = await JobCollection.insertOne(jobData)
            res.send(result)
        })
        // post data which user bids on job catagory
        app.post('/my-selected-bids', async (req, res) => {
            const myBids = req.body;
            const result = await MyBidsCollection.insertOne(myBids);
            res.send(result)
        })

        // get posted data for showing in Brows by catagory
        app.get('/jobcatagory', async (req, res) => {
            const resuls = await JobCollection.find().toArray();
            res.send(resuls)
        })


        // get data which user bids on job catagory
        app.get('/my-selected-bids', async (req, res) => {
            const resuls = await MyBidsCollection.find().toArray();
            res.send(resuls)
        })


        // put add job data like update data
        app.put('/jobcatagory/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body
            // console.log(id,"update");
            const filter = {
                _id: new ObjectId(id)
            };
            // console.log(filter,"filter");
            const options = {
                upsert: true
            };
            const updateJobPost = {
                $set: {
                    jobtitle: updateInfo.jobtitle,
                    deadline: updateInfo.deadline,
                    minimumprcie: updateInfo.minimumprcie,
                    maximumprice: updateInfo.maximumprice,
                    description: updateInfo.description,
                    catagory: updateInfo.catagory,
                },
            };
            const result = await JobCollection.updateOne(filter, updateJobPost, options);
            res.send(result)
        })

        // delete job posted data 
        app.delete('/jobcatagory/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await JobCollection.deleteOne(query);
            res.send(result);
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Server Is Running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})