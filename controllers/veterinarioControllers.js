import Veterinario from "./../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generearId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "./../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;
    const existeUsuario = await Veterinario.findOne({email});

    if(existeUsuario) {
        const error = new Error("El Usuario ya Existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar email para confirmar la cuenta del usuario
        emailRegistro({ email, nombre, token: veterinarioGuardado.token });
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }

}

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
}

//Confirmar la cuenta
const confirmar = async (req, res) => {
    //Extraemos el parametro de token
    const { token } = req.params;
    const usuarioExiste = await Veterinario.findOne({token});

    //Si el usuario no existe mandamos una respuesta de error para consumir despues en el frontend
    if(!usuarioExiste) {
        const error = new Error("Token No Valido");
        return res.status(404).json({ msg: error.message });
    }

    //El usuario existe, entonces confirmamos y eliminamos el token
    try {
        usuarioExiste.token = null;
        usuarioExiste.confirmado = true;
        await usuarioExiste.save();
        res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
        console.log(error);
    }

}

//Mandar datos para hacer login
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Verificamos si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario) {
        const error = new Error("El Usuario No Existe");
        return res.status(403).json({ msg: error.message });
    }

    //Revisamos que el usuario este autenticado
    if(!usuario.confirmado) {
        const error = new Error("El Usuario No esta Autenticado");
        res.status(403).json({ msg: error.message });
    }

    //Revisamos si el password es correcto
    if( await usuario.comprobarPassword(password) ) {
        //Generamos un JWT
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
        
    } else {
        const error = new Error("El Password es Incorrecto");
        res.status(404).json({ msg: error.message });
    }

}

const olvidePassword = async(req, res) => {
    const { email } = req.body;
    //Revisar si el ussuario con ese email existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario) {
        const error = new Error("El Usuario No Existe");
        return res.status(403).json({ msg: error.message });
    }

    //Generar un token
    try {
        usuario.token = generearId();
        await usuario.save();
        
        //Mandamos el email para reestablecer el password
        emailOlvidePassword({
            email,
            nombre: usuario.nombre,
            token: usuario.token
        });

        res.json({ msg: "Hemos Enviado un Email con las Instrucciones" });
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async(req, res) => {
    const { token } = req.params;

    //Verificar si existe un usuario con ese token
    const tokenValido = await Veterinario.findOne({ token });

    if(tokenValido) {
        res.json({ msg: "El token es valido" })
    } else {
        const error = new Error("El Token No es Valido");
        res.status(403).json({ msg: error.message });
    }
}

const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const veterinario = await Veterinario.findOne({ token });

    //El Token no esta asociado a un documento de la DB
    if(!veterinario) {
        const error = new Error("Hubo un Error");
        return res.status(403).json({ msg: error.message });
    }

    //El token si pertenece a un documento de la coleccion
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "El Password se Cambio Correctamente" });
    } catch (error) {
        console.log(error);
    }

}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error("Hubo un Error");
        return res.status(400).json({ msg: error.message });
    }

    const {email} = req.body;
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail) {
            const error = new Error("Ese Email ya Esta en Uso");
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email =  req.body.email;
        veterinario.web =  req.body.web;
        veterinario.telefono =  req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
     console.log(error);   
    }
}

const actualizarPassword = async (req, res) => {
    //Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    //Comprbar si el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error("Hubo un Error");
        return res.status(400).json({ msg: error.message });
    }

    //Probar su password
    if( await veterinario.comprobarPassword(pwd_actual) ) {
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({ msg: "Password Almacenado Correctamente" });
    } else {
        const error = new Error("El Password Actual es Incorrecto");
        return res.status(400).json({ msg: error.message });
    }
}

export  {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}