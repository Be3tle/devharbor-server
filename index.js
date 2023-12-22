const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.bvbzn4c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db('dhDB').collection('users');
    const taskCollection = client.db('dhDB').collection('tasks');

    // users api
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      let query = {};
      if (req.query?.reqEmail) {
        query = { reqEmail: req.query?.reqEmail };
      }
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    // tasks api

    app.post('/tasks', async (req, res) => {
      const taskItem = req.body;
      const result = await taskCollection.insertOne(taskItem);
      res.send(result);
    });

    // Additional database operations can be performed here
  } finally {
    // Don't forget to close the connection when done
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('DH is running');
});

app.listen(port, () => {
  console.log(`DH is listening on port: ${port}`);
});
