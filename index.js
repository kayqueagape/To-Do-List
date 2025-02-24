import e from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';
require('dotenv').config();

const port = process.env.PORT || 5844;
const mongoURI = process.env.MONGO_URI;
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = e();

app.use(e.json());
app.use(cors());

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

run().catch((error) => console.log(error));

const saveRandomNames = async () => {
  try {
    const db = client.db('produtos');
    const collection = db.collection('test');

    const randomName = faker.person.fullName();

    const result = await collection.insertOne({ name: randomName });
    console.log(`Nome salvo: ${randomName} com ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Erro ao salvar nome no banco de dados:', error);
  }
};

setInterval(saveRandomNames, 10000); 

app.get('/', (req, res) => {
  res.send('Car Junction Backend Server Running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
