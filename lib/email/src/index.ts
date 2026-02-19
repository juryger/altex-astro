import path from "path";
import fs_sync from "fs";
import fs from "fs/promises";
import Handlebars from "handlebars";

const getHtmlTemplate = async (
  fileName: string,
  rootPath?: string,
): Promise<string> => {
  const templatesPath = rootPath ?? process.env.EMAIL_TEMPLATES_PATH;
  if (templatesPath === undefined) {
    throw new Error(
      "The email templates path is required, check the value of environment variable 'EMAIL_TEMPLATES_PATH'.",
    );
  }
  const htmlTemplatePath = path.resolve(templatesPath, fileName);
  if (!fs_sync.existsSync(htmlTemplatePath)) {
    throw new Error(
      `Required email template file is not found, file path: ${htmlTemplatePath}`,
    );
  }
  return await fs.readFile(htmlTemplatePath, "utf8");
};

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string;
  subject: string;
  templateName: string;
  templateVariables?: Record<string, string>;
}) => {
  try {
    const htmlTemplate = await getHtmlTemplate(templateName);
    const hbDelegate = Handlebars.compile(htmlTemplate);
    const html = hbDelegate(templateVariables);

    console.info("sendEmail", {
      to,
      subject,
      templateName,
      templateVariables,
      html,
    });

    return { ok: true, error: undefined };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
};

// const result = sendEmail({
//   to: "juryger@gmail.com",
//   subject: "Test email for new order",
//   templateName: "new-order.html",
//   templateVariables: {
//     orderNo: "WEB-01",
//   },
// });
// console.log(result);
