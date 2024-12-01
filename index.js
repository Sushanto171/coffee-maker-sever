const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zizn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("coffeeDB");
    const coffeesCollection = database.collection("coffees");
    const userCollection = database.collection("users");


// user database
app.post("/users",async (req, res)=>{
  const data = req.body;
  const result = await userCollection.insertOne(data);
  res.send(result)
});

app.get("/users" , async(req, res)=>{
  const query = {};
  const cursor = userCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

app.get("users/:id", async (req, res)=>{
  const id = req.params.id;
  const query ={_id : new ObjectId(id)};
  const result = await userCollection.findOne(query);
  res.send(result)
})
app.get("/user/via-email/:email",async (req, res)=>{
  const email = req.params.email;
  const query ={email};
  const result =  await userCollection.findOne(query);
  res.send(result? true: false);
})

app.patch("/users" , async(req, res)=>{
  const email = req.body.email;
  const filter = {email};
  const updatedDoc = {
    $set: {
      lastSignInTime: req?.body?.lastSignInTime,
    }
  };
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
}) 

app.delete("/users",async (req, res)=>{
    const id = req.body;
    const filter = {_id: new ObjectId(id)};
    const result = await userCollection.deleteOne(filter);
    res.send(result)
})























    app.post('/addCoffee', async (req, res) =>{
        const coffee = req.body; 
        // console.log(`coffee add hitting.. ${JSON.stringify(coffee)}`)
        // console.log("coffee add hitting", coffee)
        const result = await coffeesCollection.insertOne(coffee);
        res.send(result);
    });

    app.get("/coffees", async (req, res)=>{
      const options = {upsert: true};
         const query = {}
         const result = await coffeesCollection.find(query, options).toArray();
         res.send(result);
    })

    app.get("/coffees/:id", async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    })

    app.delete("/deleteCoffee/:id", async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        console.log(id)
        const result = await coffeesCollection.deleteOne(query)
        res.send(result)
        console.log(result)
    })

    app.put(`/updateCoffee/:id`, async (req, res) =>{
      const id = req.params.id;
        const coffee = req.body;
        const updateCoffee ={
          $set: coffee
        }
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const result = await coffeesCollection.updateOne(filter, updateCoffee, options);
        res.send(result);
        console.log( coffee)
    })
    


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res)=>{
    res.send("espresso-emporium on start..")
});

app.listen(port , ()=>{
    console.log(`espresso-emporium running on port : ${port}`)
 
})