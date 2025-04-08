const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


// OBTENER CATEGORIAS 
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where:{isActive: true}
        });
        res.json(categories);
    } catch (error) {
        return res.status(500).json({message: "Error al obtener categorias"});
    }


}

// NUEVA CATEGORIA

const createCategory = async (req, res) => {

    try {
        const {name, parentId} = req.body;
    
        const veryfiCategory = await prisma.category.findUnique({where: {name}});
    
        if(veryfiCategory){
            return res.status(400).json({message: "Categoria existente"})
        }
    
        const category = await prisma.category.create({
            data: {
                name,
                parentId
            }
        })
    
        res.status(201).json({message: "Categoria creada"})
        
    } catch (error) {
        console.log(error, "Error al crear categoria");
        res.status(500).json({message: "Error del servidor, intente mas tarde"})
    }
}

// BORRADO LOGICO DE CATEGORIA 

const deleteCategory = async (req,res) => {
    try {
        const {id} = req.params;
        const category = await prisma.category.update({
            where: {id: Number(id)},
            data: {isActive: false}
        })
        res.status(204).send();
    } catch (error) {
        res.status(400).json({message: "Error al borrar categoria"})
    }

    
}

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
}