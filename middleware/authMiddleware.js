import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {

    let token;
    console.log(req.headers)
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -confirmado -token");
            console.log(req.veterinario)
            return next();
        } catch (error) {
            const e = new Error("Token No Valido");
            return res.status(403).json({ msg: e.message });
        }
    }

    //Si no se llena el token mandar erorr
    if(!token) {
        const error = new Error("Token No Valido o No Existe");
        res.status(403).json({ msg: error.message });
    }

    next();
}

export default checkAuth;