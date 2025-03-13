const express = require("express");
const router = express.Router();

// Definir las rutas para usuarios
router.get("/", (req, res) => {
    res.send("Obteniendo productos");
});

module.exports = router;
