import mongoose from "mongoose";

const PacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now(),
        required: true
    },
    sintomas: {
        type: String,
        required: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario"
    },
}, { timestamps: true });

const Paciente = mongoose.model("Paciente", PacientesSchema);

export default Paciente;