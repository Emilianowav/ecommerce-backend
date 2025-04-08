const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


const getProducts = async (req,res) => {
    try {
        const products = await prisma.product.findMany({
            where: {isActive: true},
            include: {
                categories: true,
                images: true,
            }
            
        });
        res.json(products)
    } catch (error) {
        res.status(500).json({message: "Error al obtener productos"})
    }
}


// OBTENER PRODUCTO POR NOMBRE O CATEGORIA 

const getSearchedProduct = async (req,res) => {
    try {
        const {query} = req.query;

        if(!query || typeof query !== "string"){
            return res.status(400).json({message: "No encontrado"})
        }

        const products = await prisma.product.findMany({
            where: {
                name:{
                    contains: query,
                    mode: "insensitive"
                },
                isActive: true,
            },
            
            include: {
                images:true,
                categories: true
            }
        })

        return res.json(products)

    } catch (error) {
        console.error("Error al buscar productos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

// OBTENER PRODUCTO UNICO
const getProductBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
  
      if (!slug || typeof slug !== "string") {
        return res.status(400).json({ message: "Slug inválido" });
      }
  
      const product = await prisma.product.findUnique({
        where: {
          slug: slug.toLowerCase(),
        },
        include: {
          images: true,
          categories: true,
        },
      });
  
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      return res.json(product);
    } catch (error) {
      console.error("Error al obtener producto por slug:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  

// CREAR PRODUCTO

const createProduct = async (req, res) => {
    
    try {
        const { name, description, price, stock, categories, imageUrls } = req.body;
        const normalizedName = name.trim().toLowerCase();


        const existingProduct = await prisma.product.findFirst({
        where: {
            name: {
            equals: normalizedName,
            mode: 'insensitive'
            },
            isActive: true
        }
        });
            
        console.log("🔍 Producto encontrado:", existingProduct)

        if (existingProduct) {
            return res.status(400).json({ message: "No se permiten productos idénticos" });
        }

        // Crear el producto sin imágenes
        const product = await prisma.product.create({
            data: {
              name,
              description,
              price: price.toFixed(2),
              stock,
              categories: {
                connect: categories.map(id => ({ id }))
              },
              images: {
                create: imageUrls.map(url => ({ url }))
              }
            },
            include: { categories: true, images: true }
          });

        res.status(201).json(product);  // Cambiar a un mensaje después de terminar el controlador

    } catch (error) {
        console.error("Error en createProduct:", error); // Log detallado
        res.status(500).json({ 
            message: "Error al crear el producto", 
            error: error.message || error 
        });
    }
};

// BORRADO LOGICO DE PRODUCTO 

const deleteProduct = async (req,res) => {
    try {
        const {id} = req.params;
        const product = await prisma.product.update({
            where: {id: Number(id)},
            data: {isActive: false}
        })
        res.status(204).send()
    } catch (error) {
        res.status(400).json({message: "Error al eliminar producto", error})
    }
} 

module.exports = {
    getProducts,
    getSearchedProduct,
    getProductBySlug,
    createProduct,
    deleteProduct
}