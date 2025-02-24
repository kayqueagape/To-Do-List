import e from 'express';
import cors from 'cors';
require('dotenv').config();
const port = process.env.PORT || 5844;
const mongoURI = process.env.MONGO_URI;
import { MongoClient, ServerApiVersion } from 'mongodb';

//app
const app = e();

//middlewares
app.use(e.json());
app.use(cors());

//mongo URI
const client = new MongoClient(mongoURI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

const run = async () => {
try{
    await client.connect();

     await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
}
finally{

}
}

run().catch(error => console.log)

app.get('/',(req,res)=>{
    res.send('Car Junction Backend Server Running...')
})

app.listen(port,()=>{
    console.log(console.log(`Server is running on port ${port}`))
})