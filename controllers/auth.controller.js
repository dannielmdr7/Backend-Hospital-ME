const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //Verificar Email
    const usuarioDb = await Usuario.findOne({ email });
    if (!usuarioDb) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }
    //Verificar Contraseña
    const validatePassword = bcrypt.compareSync(password, usuarioDb.password);
    if (!validatePassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña no válida",
      });
    }
    //Generar el TOKEN JWT
    const token = await generarJWT(usuarioDb.id);
    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;
  try {
    const { name, email, picture } = await googleVerify(googleToken);
    const usuarioDb = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDb) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        google: true,
        img: picture,
      });
    } else {
      usuario = usuarioDb;
      usuario.password = "@@@";
      usuario.google = true;
    }
    usuario.save();
    const token = await generarJWT(usuario.id);
    res.json({
      ok: true,
      msg: "Google signIn funcionó",
      usuario,
      token,
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Token Inválido",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
