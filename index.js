const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(express.json());
app.use(cors());

//Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rpx5h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('carMechanic');
    const servicesCollection = database.collection('services');

    // Get api to show all services
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // Get API tos show single service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // POST API
    app.post('/services', async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await servicesCollection.insertOne(service);
      console.log('hitting the post api', service);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.get('/hello', (req, res) => {
  res.send('Hello everyone');
});
app.listen(port, () => {
  console.log('Listening port  ', port);
});

/*
One time:
1. heroku account open
2. Heroku softare install

## For Every Project
1. git init
2. .gitignore
3. .gitignore(node_module, .env)
4. push everything to git
5. make sure you have this script: "start":"node index.js"
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main
---------
update:
1. save everything check locally
2. git add ., git commit -m, git push
3. git push heroku main
4.
*/
