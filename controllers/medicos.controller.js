const { response } = require("express");
const Medico = require("../models/medico.model");

const getMedico = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre")
    .populate("hospital", "nombre");
  res.json({
    ok: true,
    medicos,
  });
};
const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({ usuario: uid, ...req.body });
  try {
    const medicoDb = await medico.save();
    res.json({
      ok: true,
      medico: medicoDb,
      msg: "Post Medico",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comuniquese con el Administrador",
    });
  }
};
const actualizarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: "Put Meidico",
  });
};
const borrarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: "Delete Medico",
  });
};

module.exports = {
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
