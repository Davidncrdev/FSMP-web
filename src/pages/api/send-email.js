import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function post({ request }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const reason = formData.get('reason');
  const message = formData.get('message');

  if (!name || !email || !reason || !message) {
    return new Response(JSON.stringify({ message: 'Todos los campos son requeridos.' }), { status: 400 });
  }

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
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `Nombre: ${name}\nCorreo: ${email}\nMotivo: ${reason}\nMensaje: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Correo enviado exitosamente.' }), { status: 200 });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    return new Response(JSON.stringify({ message: 'Error enviando el correo.' }), { status: 500 });
  }
}
