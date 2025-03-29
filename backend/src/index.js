const express = require('express');
const cors = require('cors');
require('./schemas/postgres');
const userRouter = require('./routers/user');
const adminRouter = require('./routers/admin')
const carRouter = require('./routers/car')
const dotenv = require('dotenv');
dotenv.config();
// console.log(`Your port is ${process.env.PORT}`); // 8626

const app = express();
const port = process.env.PORT;

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    credentials: true,
    origin: '*'
    }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter)
app.use(carRouter)
app.use(adminRouter)
// Middleware


app.listen(port ,() => console.log(`Server is up on port  ${port}!`));




// const csv = require('csvtojson');
// const MongoClient = require('mongodb').MongoClient;

// async function importCsvDataToMongoDB(csvFilePath, mongoDbUrl, dbName, collectionName) {
//   try {
//     // Connect to MongoDB
//     const client = await MongoClient.connect(mongoDbUrl, { useNewUrlParser: true });
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Convert CSV to JSON
//     const jsonArray = await csv().fromFile(csvFilePath);

//     // Insert JSON data into MongoDB
//     await collection.insertMany(jsonArray);

//     console.log('CSV data has been imported into MongoDB.');
//     client.close();

//   } catch (error) {
//     console.error('Error importing CSV data to MongoDB:', error);
//   }
// }

// importCsvDataToMongoDB("D://Graduation Project//Car databases//cars2.csv", process.env.MONGODB_URL, "FOTA", "cars")

