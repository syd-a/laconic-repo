const mongoose = require("mongoose");
const mongoKey = require("./config/secrets/mongo_key").mongoKey;

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const passport = require("passport");
require("./config/passport_config")(passport);
const speakerRouter = require("./routes/speaker_router");
const aphorismRouter = require("./routes/aphorism_router");

mongoose.connect(
  mongoKey,
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err, success) => {
    if(err) {
      console.log("Error connecting to MongoDB cluster:");
      console.log(err);
    } else {
      console.log("Success connecting to MongoDB cluster.");
    }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

if(process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/home/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API listening on port ${port}.`));

app.use("/api/speakers/", speakerRouter);
app.use("/api/aphorisms/", aphorismRouter);
