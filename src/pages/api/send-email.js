import nodemailer from 'nodemailer';
import 'dotenv/config';

export async function post({ request }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const reason = formData.get('reason');
    const message = formData.get('message');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Davidkabre25@gmail.com',
      subject: `Nuevo mensaje de ${name} - ${reason}`,
      text: `
        Nombre: ${name}
        Correo: ${email}
        Razón: ${reason}
        Mensaje: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Correo enviado: %s', info.messageId);

    return new Response(JSON.stringify({ message: 'Correo enviado exitosamente' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    return new Response(JSON.stringify({ message: 'Error enviando el correo', error: error.message }), {
      status: 500,
    });
  }
}
