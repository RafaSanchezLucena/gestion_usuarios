const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const cors = require("cors");



// Servidor web
app.listen(3000, () => {
    console.log("Servidor creado en puerto 3000");
});


// Acceso a la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));

// Ajustes
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


// Ajustes motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));


// Usar los ficheros con su extensión real
app.engine("html", require("ejs").renderFile);
app.engine("js", require("ejs").renderFile);


// Importar rutas
app.use(
  require("./routes")
);

