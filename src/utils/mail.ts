import { Injectable } from "@nestjs/common";
const sgMail = require('@sendgrid/mail');

interface IMailCreationInput {
  to: string,
  data: {
    password: string,
    role: string
  }
}

interface IPasswordRecoveryCode {
  to: string,
  data: {
    recovery_code: string,
    user: string,
  }
}

@Injectable()
export class MailUtil {

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendAccountCreationEmail(input: IMailCreationInput) {
    try {
      let outcome = await sgMail.send({
        templateId: "d-145a6b30f69b415da07574bde396f7ae",
        dynamicTemplateData: {
          email: input.to,
          password: input.data.password,
          role: input.data.role
        },
        to: input.to,
        from: process.env.SENDGRID_EMAIL
      });

    } catch (e) {
      console.error(e);
    }
  }

  async sendRecoveryCode(input: IPasswordRecoveryCode) {
    try {
      let outcome = await sgMail.send({
        templateId: "d-cbef3768662743079bdf03d3fe184709",
        dynamicTemplateData: {
          recovery_code: input.data.recovery_code,
          user: input.data.user,
        },
        to: input.to,
        from: process.env.SENDGRID_EMAIL
      });

      console.log(outcome);
    } catch (e) {
      console.error(e?.response?.body);
    }
  }
}
