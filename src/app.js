const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV != "production") {
  const morgan = require("morgan");
  require("dotenv").config();
  app.use(morgan("dev"));
}
app.use(express.json());

// rutas
app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log("aplicacion ejecutandose en el puerto: ", port);
});
