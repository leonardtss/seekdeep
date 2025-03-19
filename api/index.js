const express = require('express')
const app = express()
const port = 4000
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors")
app.use(cors());
app.use(express.json());



const conversationRoutes = require("./routes/conversations");

// MongoDB Connection
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

main().catch((err)=>console.log(err))

app.use("/api/conversations", conversationRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


