import nodemailer from "nodemailer";
import type { Mail } from "../types/notification.types";

export class Notification {
  private readonly user: string;
  private readonly pass: string;

  constructor(user: string, pass: string) {
    this.user = user;
    this.pass = pass;
  }

  async sendMail(content: Mail) {
    // make transport
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    const result = await transport.sendMail(content);
    return result;
  }
}
