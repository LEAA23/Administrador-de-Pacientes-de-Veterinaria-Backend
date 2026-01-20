import nodemailer from "nodemailer";

const emailRegistro = async({email, nombre, token}) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `
            <p>Hola: ${nombre} comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya esta lista, solamente debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">ComprobarCuenta</a>
            <p>

            <p>Si tu no comprobaste esta cuenta puedes ignorar este mensaje</p>

        `
    });

    console.log("mensaje enviado %s", info.messageId);
}

export default emailRegistro;