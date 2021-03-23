const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  // console.log(desde);
  // const usuarios = await Usuario.find({}).skip(desde).limit(5);
  // const total = await Usuario.count();
  const [usuarios, total] = await Promise.all([
    Usuario.find({}).skip(desde).limit(5),
    Usuario.count(),
  ]);
  res.json({
    ok: true,
    usuarios,
    total,
  });
};

const crearUsuarios = async (req, res = response) => {
  const { email, password, nombre } = req.body;

  try {
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }
    const usuario = new Usuario(req.body);
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    //generar Token
    const token = await generarJWT(usuario.id);

    await usuario.save();
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error inesperado",
    });
  }
};
const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioExiste = await Usuario.findById(uid);
    if (!usuarioExiste) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }
    const { password, google, email, ...campos } = req.body;
    if (usuarioExiste.email != email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "El correo ya existe",
        });
      }
    }
    campos.email = email;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};
const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDb = await Usuario.findById(uid);
    if (!usuarioDb) {
      res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }
    await Usuario.findByIdAndDelete(uid);
    return res.json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
};
