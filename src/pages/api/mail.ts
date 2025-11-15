import 'dotenv/config';
import nodemailer from 'nodemailer';

export const prerender = false;

export async function POST({ request }: { request: Request }) {
    const form = await request.formData();

    const data = {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        date: form.get("date"),
        guests: form.get("guests"),
        package: form.get("package"),
        message: form.get("message"),
    };

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true, // true for port 465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"${data.name}" <${data.email}>`,
        to: process.env.TO_EMAIL,
        subject: `Ny cateringförfrågan från ${data.name}`,
        html: `
      <h2>Ny förfrågan</h2>
      <p><strong>Namn:</strong> ${data.name}</p>
      <p><strong>E-post:</strong> ${data.email}</p>
      <p><strong>Telefon:</strong> ${data.phone || '-'}</p>
      <p><strong>Datum:</strong> ${data.date || '-'}</p>
      <p><strong>Gäster:</strong> ${data.guests || '-'}</p>
      <p><strong>Paket:</strong> ${data.package}</p>
      <p><strong>Meddelande:</strong><br>${data.message || '-'}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response(null, {
            status: 303,
            headers: { Location: '/success' },
        });
    } catch (error: any) {
        console.error("Email error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

