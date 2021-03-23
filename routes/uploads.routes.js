// Hospitales
// Ruta /api/hospitales
const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  fileUpload,
  retornaImagen,
} = require("../controllers/uploads.controller");
const ExpressfileUpload = require("express-fileupload");

const router = Router();
router.use(ExpressfileUpload());

router.put("/:tipo/:id", [validarJWT], fileUpload);
router.get("/:tipo/:foto", [validarJWT], retornaImagen);

module.exports = router;
