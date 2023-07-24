const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json());

// mongodb connections

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://CampusQuest:SzAr8wwOjMZe4aJ1@cluster0.mucefdr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
   
  });

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await
         client.connect((error) => {
          if(error){
            console.log(error)
            return;
          }
         });
        const collegesCollections = client.db('Campusquest').collection('Colleges');
        const AdmissionCollection = client.db('Campusquest').collection('admission');


        // get all Colleges information
        app.get('/colleges', async (req, res) => {
            const result = await collegesCollections.find().toArray();
            res.send(result);
        })
        // get all Colleges information
        app.get('/SingleColleges/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }; // Use ObjectId to create a valid query
                const result = await collegesCollections.findOne(query);
                if (!result) {
                    res.status(404).send('College not found'); // If no college found with the given ID
                } else {
                    res.send(result);
                }
            } catch (error) {
                res.status(500).send('Error retrieving college details');
            }
          })

        //   post admission information
         // Insert Data
    app.post('/admission', async (req, res) => {
        const admissionData = req.body;
        const result = await AdmissionCollection.insertOne(admissionData);
        res.send(result);
      })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('University admission processing')
});

app.listen(port, () => {
    console.log(`University admission is running on port ${port}`)
});
