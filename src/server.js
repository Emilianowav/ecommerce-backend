require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// importar rutas 
const userRoutes = require("./routes/UserRoutes")
const productRoutes = require("./routes/ProductRoutes")
const categoryRoutes = require("./routes/CategoryRoutes")

// middlewares
app.use(cors());
app.use(express.json());


// rutas
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/category", categoryRoutes)

// Ruta de prueba
app.get('/', (req, res) => {  // 12
    res.send('¡Bienvenido al Ecommerce API!');  // 13
  });

// errores
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send({error: "Algo salió mal, por favor inténtalo de nuevo más tarde."});
})

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

async function connectDB () {
    try{
        await prisma.$connect()
        console.log("Conectando a la base de datos")
    }
    catch (error){
        console.error("Error de conexión a la base de datos', error")
        process.exit(1);
    }
};

app.listen(port, ()=>{
    connectDB();
    console.log(`Servidor corriendo en http://localhost:${port}`);
})