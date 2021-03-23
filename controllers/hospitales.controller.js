const { response } = require("express");
const Hospital = require("../models/hospital.model");

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate("usuario", "nombre");
  res.json({
    ok: true,
    hospitales,
  });
};
const crearHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ usuario: uid, ...req.body });
  console.log(uid);
  try {
    const hospitalDb = await hospital.save();
    res.json({
      ok: true,
      hospital: hospitalDb,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el Administrador",
    });
  }
};
const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDb = await Hospital.findById(id);
    if (!hospitalDb) {
      return res.status(500).json({
        ok: true,
        msg: "hospital no encontrado",
        id,
      });
    }
    const cambioHospital = {
      ...req.body,
      usuario: uid,
    };
    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambioHospital,
      { new: true }
    );
    res.json({
      ok: true,
      msg: "Put Hospital",
      hospitalActualizado,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const borrarHospital = async (req, res = response) => {
  const id = req.params.id;
  const hospitalDb = await Hospital.findByIdAndDelete(id);
  if (!hospitalDb) {
    return res.json({
      ok: true,
      msg: "Hospital no encontrado",
    });
  }
  res.json({
    ok: true,
    msg: "Hospital eliminado correctamente",
  });
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
