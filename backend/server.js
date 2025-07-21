const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 8070;

app.use(cors());
// app.use(bodyParser.json());

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

const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/v1/admin", adminRoutes);