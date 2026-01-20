import jwt from "jsonwebtoken";

const generarJWT = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: "30d" });
}

export default generarJWT;