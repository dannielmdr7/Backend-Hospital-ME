require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { conexion } = require("./database/config");

const app = express();
//Base de datos
conexion();
// Configurar CORS
app.use(cors());
//Lectura y Parseo del Body
app.use(express.json());

//Directorio público
app.use(express.static("public"));

//Rutas
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/hospitales", require("./routes/hospitales.routes"));
app.use("/api/medicos", require("./routes/medicos.routes"));
app.use("/api/login", require("./routes/auth.routes"));
app.use("/api/todo", require("./routes/busquedas.routes"));
app.use("/api/upload", require("./routes/uploads.routes"));

app.listen(process.env.PORT, () => {
  console.log(
    "Servidor de express funcionando en el puerto: " + process.env.PORT
  );
});
