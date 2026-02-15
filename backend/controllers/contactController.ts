import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail.js";

export const sendContactEmail = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const emailMessage = `
      You have a new contact form submission:
      
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `;
    
    // Send to admin (Hardcoded as requested)
    await sendEmail({
      email: "adityalucky52@gmail.com",
      subject: `Contact Form: ${subject}`,
      message: emailMessage,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Email could not be sent. Please try again later.", error: error.message });
  }
};
