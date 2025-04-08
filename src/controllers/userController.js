const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// OBTENER TODOS LOS USUARIOS 
const getUsers = async (req , res) => {
    try{
        const users = await prisma.userAuth.findMany();
        res.json(users)
    }
    catch(error){
        res.status(500).json({"Error al obtener los usuarios": error})
    }
}


// OBTENER USUARIO UNICO 
const getUsersById = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await prisma.userAuth.findUnique({ where: {id: Number (id) }})
        if(!user) return res.status(404).json({error: "Usuario no encontrado"})
    } catch (error) {
        res.status(500).json({"Error al obtener el usuario": error})
    }
}

// CREAR UN NUEVO USUARIO

const createNewUserAuth = async (req, res) => {
    const { name, email, passwordHash, role } = req.body;
    console.log(req.body);

    // Comprobación de existencia de email y nombre de usuario
    const existingUserEmail = await prisma.userAuth.findUnique({ where: { email } });
    const existingUsername = await prisma.userAuth.findUnique({ where: { username: name } });

    if (existingUserEmail) {
        return res.status(400).json({ field: "email", message: "Correo electrónico ya registrado" });
    }

    if (existingUsername) {
        return res.status(400).json({ field: "name", message: "Nombre de usuario no disponible" });
    }

    try {
        const passwordHashed = await bcrypt.hash(passwordHash, 10)
        const newUserAuth = await prisma.userAuth.create({
            data: {
                username: name,
                email,
                passwordHash : passwordHashed,
                role,
            }
        });

        // Aquí podrías enviar un correo de confirmación o cualquier otra acción
        return res.status(201).json({
            message: "Usuario creado exitosamente. Por favor, complete su perfil.",
            userAuth: newUserAuth, 
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};

const createUserProfile = async (req, res) => {
    const { userId, fullName, phone } = req.body;

    try {
        // Asegurarse de que el usuario exista
        const existingUserAuth = await prisma.userAuth.findUnique({ where: { id: userId } });

        if (!existingUserAuth) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Crear el perfil
        const newUserProfile = await prisma.userProfile.create({
            data: {
                fullName,
                phone,
                auth: { connect: { id: userId } }, // Asociar el UserProfile con el UserAuth
            }
        });

        return res.status(201).json({
            message: "Perfil creado exitosamente.",
            userProfile: newUserProfile,
        });
    } catch (error) {
        console.error("Error al crear perfil:", error);
        res.status(500).json({ message: "Error al crear perfil", error: error.message });
    }
};

const userLogin = async (req,res) => {
    const {username, password} = req.body;

    try{
        const user = await prisma.userAuth.findUnique({where: {username}})
        if(!user){
           return res.status(401).json({message: "Usuario o contraseña incorrecta"})
        }
        const correctPassword = await bcrypt.compare(password, user.passwordHash)
        if(!correctPassword){
           return res.status(401).json({message: "Usuario o contraseña incorrecta"})
        }
        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            // {expiresIn: "2h"}
        )
        res.json({
            message: "Iniciando Sesion",
            token,
            user: {
                userId: user.id,
                userName: user.username,
                email: user.email,
                role: user.role
            }
        })
    }
    catch(error){
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
}

// EXPORTAR FUNCIONES

module.exports = {
    getUsers,
    getUsersById,
    createNewUserAuth,
    createUserProfile,
    userLogin
}