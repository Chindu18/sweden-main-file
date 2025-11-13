import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  try {
    await resend.emails.send({
      from: `${name} <noreply@tamilmovie.no>`, // verified sender
      to: "tamilfilmsweden@gmail.com",
      subject: `New message from ${name}`,
      text: `${message}\n\nFrom: ${name} (${email})`,
      html: `<p>${message}</p><p>From: <strong>${name}</strong> (${email})</p>`,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Failed to send email." });
  }
};
