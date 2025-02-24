import e from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5844;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MONGO_URI não definida!');
  process.exit(1);
}

const app = e();
app.use(e.json());
app.use(cors());

// Configuração do cliente MongoDB
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  tls: true, // Ative se estiver usando MongoDB Atlas
});

let db; // Mantenha a conexão global

// Função de conexão com reconexão automática
const connectWithRetry = async () => {
  try {
    await client.connect();
    db = client.db('produtos');
    console.log('Conectado ao MongoDB!');
    setInterval(saveRandomNames, 10000); // Inicia o intervalo após a conexão
  } catch (error) {
    console.error('Erro de conexão. Tentando novamente em 5 segundos...', error);
    setTimeout(connectWithRetry, 5000);
  }
};

// Função para salvar nomes
const saveRandomNames = async () => {
  try {
    const collection = db.collection('test');
    const randomName = faker.person.fullName();
    const result = await collection.insertOne({ name: randomName });
    console.log(`Nome salvo: ${randomName} (ID: ${result.insertedId})`);
  } catch (error) {
    console.error('Erro ao salvar nome:', error);
  }
};

// Iniciar conexão
connectWithRetry();

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor está rodando...');
});

// Encerrar conexão ao fechar o servidor
process.on('SIGTERM', async () => {
  await client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
