const path = require("path");
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const fs = require("fs");

const fileUpload = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  const tiposPermitidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposPermitidos.includes(tipo)) {
    res.status(400).json({
      ok: false,
      msg: "No es un médico. usuario u hospital",
    });
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }
  const file = req.files.imagen;
  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];
  //Extensiones Válidas
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];

  if (!extensionesValidas.includes(extensionArchivo)) {
    res.status(400).json({
      ok: false,
      msg: "No es un formato de archivo permitido",
    });
  }
  //Nombre del Archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
  //Directorio del Archivo
  let path = `./uploads/${tipo}/${nombreArchivo}`;

  //   Mover la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }

    //Actualizar la Base de Datos
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo cargado correctamente",
      nombreArchivo,
    });
  });
};

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;
  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
  //Verificación del path
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
