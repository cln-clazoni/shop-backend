require("dotenv").config();
const express = require("express");
const cors = require("cors");

const notionRoutes = require("./routes/notion.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Express funcionando y conectado a Notion!");
});

app.use("/api", notionRoutes);

module.exports = app;
