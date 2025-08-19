const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

const app = express();


app.set("trust proxy", true);
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 8070;

app.use(cors({
  origin: "http://localhost:3000", // 👈 your frontend origin
  credentials: true,               // 👈 allow cookies/auth headers
}));

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () =>  {
    console.log("✅ MongoDB connection successful !!");
})

app.listen(PORT, '0.0.0.0',() => {
    console.log(`🚀 Server is up and running on port ${PORT}`)
})

const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/v1/admin", adminRoutes);

const employeeRoutes = require("./routes/employeeRoutes");
app.use("/api/v1/employee", employeeRoutes);

const retireRoutes = require("./routes/retireRoutes");
app.use("/api/v1/retire", retireRoutes);

const loanRoutes = require("./routes/loanRoutes");
app.use("/api/v1/loans", loanRoutes);

const logRoutes = require("./routes/logRoutes");
app.use("/api/v1/logs", logRoutes);

const deathFundRoutes = require("./routes/deathFundRoutes");
app.use("/api/v1/deathFunds", deathFundRoutes);

const retirementGiftRoutes = require("./routes/retirementGiftRoutes");
app.use("/api/v1/retirementGifts", retirementGiftRoutes);