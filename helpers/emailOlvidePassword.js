import nodemailer from "nodemailer";

const emailOlvidePassword = async({email, nombre, token}) => {
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
        subject: "Reestable tu Password",
        text: "Reestable tu Password",
        html: `
            <p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>
            <p>Reestablece tu password en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            <p>

            <p>Si tu no comprobaste esta cuenta puedes ignorar este mensaje</p>

        `
    });

    console.log("mensaje enviado %s", info.messageId);
}

export default emailOlvidePassword;