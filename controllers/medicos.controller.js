const { response } = require("express");
const Medico = require("../models/medico.model");
const Hospital = require("../models/hospital.model");

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
const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const nombre = req.body.nombre;
  const hospital = req.body.hospital;
  const uid = req.uid;

  try {
    const medicoDb = await Medico.findById(id);

    if (!medicoDb) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró ningun usuario con ese id",
      });
    }
    const hospitalExiste = await Hospital.findById(hospital);
    if (hospitalExiste) {
      medicoDb.nombre = nombre;
      medicoDb.hospital = hospital;
      const medicoActualizado = await Medico.findByIdAndUpdate(id, medicoDb, {
        new: true,
      });
      return res.json({
        ok: true,
        msg: "Médico actualizado correctamente",
        medico: medicoActualizado,
      });
    }

    res.status(500).json({
      ok: false,
      msg: "El id del hospital no es valido",
    });
  } catch (error) {
    console.log(error);
    res.send(500).json({
      ok: false,
      msg: "comuniquese con el administrador",
    });
  }
};
const borrarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const medicoDb = await Medico.findById(id);
    if (!medicoDb) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró ningun usuario con ese id",
      });
    }
    const medicoEliminado = await Medico.findByIdAndDelete(id);
    res.json({
      ok: true,
      msg: "Medico Eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.send(500).json({
      ok: false,
      msg: "comuniquese con el administrador",
    });
  }
};

module.exports = {
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
