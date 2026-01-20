import Paciente from "./../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    //Agregamos el id del veterinario para relacionarlo con el paciente
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    //Obtener todos los pacientes del veterinario
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario);
    res.json(pacientes);
}

//Obetener un paciente en base de su id
const obtenerPaciente = async(req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findOne({ _id: id });

    if(!paciente) {
        res.status(404).json({ msg: "Paciente No Encontrado" });
    }

    //Evaluamos si el id del paciente corresponde al id del paciente aguardado en la DB
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida" });
    }

    if(paciente) {
        res.json({paciente});
    }
}

const actualizarPaciente = async(req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findOne({ _id: id });

    if(!paciente) {
        return res.status(404).json({ msg: "Paciente No Encontrado" });
    }

    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {
        return res.json({ msg: "Accion No Valida" });
    }

    //El paciente se encontro, entoces se actualiza con la nueva informacion
    const { nombre, propietario, email, fecha, sintomas } = req.body;
    paciente.nombre = nombre || paciente.nombre;
    paciente.propietario = propietario || paciente.propietario;
    paciente.email = email || paciente.email;
    paciente.fecha = fecha || paciente.fecha;
    paciente.sintomas = sintomas || paciente.sintomas;
    console.log(paciente);

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }

}

//Eliminar un paciente por su id
const eliminarPaciente = async(req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findOne({ _id: id });

    if(!paciente) {
        return res.status(404).json({ msg: "Paciente No Encontrado" });
    }

    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {
        return res.json({ msg: "Accion No Valida" });
    }

    try {
        await paciente.deleteOne();
        res.json( {msg: "Paciente Eliminado" });
    } catch (error) {
        console.log(error);
    }



}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}