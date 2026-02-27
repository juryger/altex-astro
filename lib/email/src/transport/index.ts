import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import google from "googleapis";
import {
  EnvironmentNames,
  getErrorMessage,
  regexTrue,
  selectEnvironment,
  type Result,
} from "@/lib/domain";

type EmailTransport = {
  sendEmail: ({
    from,
    to,
    subject,
    content,
    attachmentContent,
  }: {
    from: string;
    to: string;
    subject: string;
    content: string;
    attachmentContent?: string;
  }) => Promise<Result>;
};

const getEmailTransport = (): EmailTransport => {
  const isTracingEnabled = regexTrue.test(
    selectEnvironment(EnvironmentNames.ENABLE_TRACING),
  );

  const oauth2Client = new google.Auth.OAuth2Client(
    selectEnvironment(EnvironmentNames.EMAIL_CLIENT_ID),
    selectEnvironment(EnvironmentNames.EMAIL_CLIENT_SECRET),
    selectEnvironment(EnvironmentNames.EMAIL_REDIRECT_URI),
  );

  oauth2Client.setCredentials({
    refresh_token: selectEnvironment(EnvironmentNames.EMAIL_REFRESH_TOKEN),
  });

  return {
    sendEmail: async ({
      from,
      to,
      subject,
      content,
      attachmentContent,
    }: {
      from: string;
      to: string;
      subject: string;
      content: string;
      attachmentContent?: string;
    }): Promise<Result> => {
      try {
        console.log(
          "🧪 ~ Email service ~ getting access token to connect to Gmail...",
        );
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: from,
            clientId: selectEnvironment(EnvironmentNames.EMAIL_CLIENT_ID),
            clientSecret: selectEnvironment(
              EnvironmentNames.EMAIL_CLIENT_SECRET,
            ),
            refreshToken: selectEnvironment(
              EnvironmentNames.EMAIL_REFRESH_TOKEN,
            ),
            accessToken: accessToken.token,
          },
          logger: isTracingEnabled,
        } as SMTPTransport.Options);

        const mailOptions = {
          from,
          to,
          subject,
          html: content,
          attachments:
            attachmentContent !== undefined
              ? [
                  {
                    filename: `new_order_${Date.now().toString()}.xml`,
                    content: attachmentContent,
                  },
                ]
              : undefined,
        };

        if (isTracingEnabled) {
          console.log(
            "🐾 ~ nodemailer ~ email: %o via transport: %o",
            {
              mailOptions,
              content,
            },
            transport,
          );
        }

        console.log(
          "🧪 ~ Email service ~ sending email via Nodmail transport (gmail)",
        );
        await transport.sendMail(mailOptions);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "Failed to send email using nodemail transport: %s",
          errorMessage,
        );
        return { status: "Failed", error: new Error(errorMessage) };
      }

      return { status: "Ok" };
    },
  };
};

export { getEmailTransport };
