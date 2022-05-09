const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// use monogoose to connect to mongodb

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/apidocs");
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Shedulr API",
      version: "0.7.0",
    },
    basePath: "/api/v1/",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./docs/users.docs.js", "./docs/shift.docs.js"],
};

const swaggerDocs = swaggerjsdoc(swaggerOptions);
app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/shift", require("./routes/shift.route"));
app.use("/api/v1/nav", require("./routes/nav.route"));
app.listen(port, () => console.log(`Server running on port ${port}`));
// display database connection
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});
