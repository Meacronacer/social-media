import nodemailer, { Transporter } from "nodemailer";

class MailService {
  transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Activation account on " + process.env.API_URL,
      text: "",
      html: `
        <div>
          <h1>For account activation please follow the link</h1>
          <a href="${link}">${link}</a>
        </div>
        `,
    });
  }

  async sendResetPasswordMail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Password Reset on " + process.env.API_URL,
      text: "",
      html: `
        <div>
          <h1>Password Reset Request</h1>
          <p>To reset your password, follow the link:</p>
          <a href="${link}">${link}</a>
          <p>If you did not request a password reset, simply ignore this email..</p>
        </div>
      `,
    });
  }
}

export default new MailService();
