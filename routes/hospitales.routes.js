// Hospitales
// Ruta /api/hospitales
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  crearHospital,
  actualizarHospital,
  borrarHospital,
  getHospitales,
} = require("../controllers/hospitales.controller");

const router = Router();

router.get("/", [validarJWT], getHospitales);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del Hospital es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);

router.put("/:id", [], actualizarHospital);
router.delete("/:id", borrarHospital);

module.exports = router;
