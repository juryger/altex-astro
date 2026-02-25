import path from "path";
import fs_sync from "fs";
import fs from "fs/promises";
import Handlebars from "handlebars";
import { getErrorMessage, type Result } from "@/lib/domain";

// Values correspondes to template file names (*.html)
enum EmailTemplates {
  NewOrder = "new-order.html",
  Failure = "failure.html",
}

enum XmlTEmplates {
  NewOrder = "new-order.xml",
}

const getTemplate = async (
  rootPath: string,
  fileName: string,
): Promise<string> => {
  if (rootPath === undefined || rootPath.trim().length === 0) {
    throw new Error(
      "The root templates path is required, check the value of environment variable 'EMAIL_TEMPLATES_PATH'.",
    );
  }
  const templatePath = path.resolve(rootPath, fileName);
  if (!fs_sync.existsSync(templatePath)) {
    throw new Error(
      `Required template file is not found, file path: ${templatePath}`,
    );
  }
  return await fs.readFile(templatePath, "utf8");
};

const applyTemplateParams = ({
  content,
  params,
}: {
  content: string;
  params: Record<string, any> | undefined;
}): string => {
  const hbDelegate = Handlebars.compile(content);
  return hbDelegate(params);
};

const prepareTemplate = async ({
  fileName,
  rootPath,
  params,
}: {
  fileName: string;
  rootPath: string;
  params: Record<string, any> | undefined;
}): Promise<string> => {
  const content = await getTemplate(rootPath, fileName);
  return applyTemplateParams({ content, params });
};

const sendEmail = async ({
  to,
  subject,
  content,
  xmlContent,
}: {
  to: string;
  subject: string;
  content: string;
  xmlContent?: string;
}): Promise<Result> => {
  console.info("sendEmail", {
    to,
    subject,
    content,
    xmlContent,
  });
  return { status: "Ok" };
};

type EmailManager = {
  sendNewOrder: ({
    toCustomer,
    toBackOffice,
    subject,
    templateParams,
  }: {
    toCustomer: string;
    toBackOffice: string;
    subject: string;
    templateParams?: Record<string, any>;
  }) => Promise<Result>;
  sendFailure: ({
    to,
    subject,
    templateParams,
  }: {
    to: string;
    subject: string;
    templateParams?: Record<string, string>;
  }) => Promise<Result>;
};

const getEmailManager = ({ rootPath }: { rootPath: string }): EmailManager => {
  return {
    sendNewOrder: async ({
      toCustomer,
      toBackOffice,
      subject,
      templateParams,
    }: {
      toCustomer: string;
      toBackOffice: string;
      subject: string;
      templateParams?: Record<string, any>;
    }): Promise<Result> => {
      console.log(
        "🧪 ~ getEmailMananger ~ sendNewOrder, params:",
        templateParams,
      );
      try {
        const content = await prepareTemplate({
          rootPath,
          fileName: EmailTemplates.NewOrder,
          params: templateParams,
        });

        await sendEmail({
          to: toCustomer,
          subject,
          content,
        });

        const xmlContent = await prepareTemplate({
          rootPath,
          fileName: XmlTEmplates.NewOrder,
          params: templateParams,
        });

        console.log(
          "🧪 ~ getEmailMananger ~ sendNewOrder, xml attachment:",
          xmlContent,
        );

        await sendEmail({
          to: toBackOffice,
          subject,
          content,
          xmlContent,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "Failed to send 'New Order' email, see more details below. %s",
          errorMessage,
        );
        return { status: "Failed", error: new Error(errorMessage) };
      }
      return { status: "Ok" };
    },
    sendFailure: async ({
      to,
      subject,
      templateParams,
    }: {
      to: string;
      subject: string;
      templateParams?: Record<string, any>;
    }): Promise<Result> => {
      try {
        const content = await prepareTemplate({
          rootPath,
          fileName: EmailTemplates.Failure,
          params: templateParams,
        });

        await sendEmail({
          to,
          subject,
          content,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "Failed to send 'Failurer' email, see more details below. %s",
          errorMessage,
        );
        return { status: "Failed", error: new Error(errorMessage) };
      }
      return { status: "Ok" };
    },
  };
};

export { getEmailManager, type EmailManager };
