// Hospitales
// Ruta /api/hospitales
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico,
} = require("../controllers/medicos.controller");

const router = Router();

router.get("/", [validarJWT], getMedico);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es necesario").not().isEmpty(),
    check("hospital", "EL id del Hospital debe ser válido").isMongoId(),
    validarCampos,
  ],
  crearMedico
);
router.put("/:id", [], actualizarMedico);
router.delete("/:id", borrarMedico);

module.exports = router;
