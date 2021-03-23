// Hospitales
// Ruta /api/hospitales
const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  busquedaTotal,
  getDocumentosColeccion,
} = require("../controllers/busquedas.controller");

const router = Router();

router.get("/:busqueda", [validarJWT], busquedaTotal);
router.get("/coleccion/:tabla/:busqueda", [validarJWT], getDocumentosColeccion);

module.exports = router;
