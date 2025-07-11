import express from 'express';
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () =>  {
    console.log("✅ MongoDB connection successful !!");
})

app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on port ${PORT}`)
})