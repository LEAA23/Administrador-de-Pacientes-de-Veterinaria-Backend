import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

//Creamos la app de express
const app = express();

//Habilitamos el envio de informacion en Post
app.use(express.json());

//Habilitamos las variables de entorno
dotenv.config()

//Conectamos a la DB medinante el ORM de Mongoose
conectarDB();

//configuramos los dominios permitidos desde los cuales podemos mandar peticiones
const dominiosPermitidos =[process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen del request esta permitido
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    }
}

app.use(cors(corsOptions));

const port = process.env.PORT || 4000;

//Habilitamos el router, cundo se visite la url que contenga /api/veterinarios se llama "/" en el router especificado
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});