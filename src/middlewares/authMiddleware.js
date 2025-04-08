const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next) => {
    const token = req.header("Authorization")

    if(!token){
        res.status(401).json({message: "Acceso no autorizado"})
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer", "").trim() , process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
}
module.exports = {verifyToken}