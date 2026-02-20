import path from "path";
import fs_sync from "fs";
import fs from "fs/promises";
import Handlebars from "handlebars";

// Values correspondes to template file names (*.html)
enum EmailTemplates {
  NewOrder = "new-order.html",
  Failure = "failure.html",
}

const getTemplate = async (
  rootPath: string,
  fileName: string,
): Promise<string> => {
  if (rootPath === undefined || rootPath.trim().length === 0) {
    throw new Error(
      "The email templates path is required, check the value of environment variable 'EMAIL_TEMPLATES_PATH'.",
    );
  }
  const htmlTemplatePath = path.resolve(rootPath, fileName);
  if (!fs_sync.existsSync(htmlTemplatePath)) {
    throw new Error(
      `Required email template file is not found, file path: ${htmlTemplatePath}`,
    );
  }
  return await fs.readFile(htmlTemplatePath, "utf8");
};

const applyTemplateParams = ({
  content,
  params,
}: {
  content: string;
  params: Record<string, string> | undefined;
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
  params: Record<string, string> | undefined;
}): Promise<string> => {
  const content = await getTemplate(rootPath, fileName);
  return applyTemplateParams({ content, params });
};

const sendEmail = async ({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}): Promise<void> => {
  console.info("sendEmail", {
    to,
    subject,
    content,
  });
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
    templateParams?: Record<string, string>;
  }) => Promise<void>;
  sendFailure: ({
    to,
    subject,
    templateParams,
  }: {
    to: string;
    subject: string;
    templateParams?: Record<string, string>;
  }) => Promise<void>;
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
      templateParams?: Record<string, string>;
    }): Promise<void> => {
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
      } catch (error) {
        console.error(error);
      }
    },
    sendFailure: async ({
      to,
      subject,
      templateParams,
    }: {
      to: string;
      subject: string;
      templateParams?: Record<string, string>;
    }): Promise<void> => {
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
        console.error(error);
      }
    },
  };
};

const manager = getEmailManager({
  rootPath: process.env.EMAIL_TEMPLATES_PATH ?? "",
});
manager.sendNewOrder({
  toCustomer: "juryger@gmail.com",
  toBackOffice: "alextechnologies@gmail.com",
  subject: "Test email for new order",
  templateParams: {
    orderNo: "WEB-01",
    companyName: "ИП Герасимов Алексей Владимирович",
    companyWeb: "http://altexweb.ru",
    companyEmail: "alextechnologies@gmail.com",
    companyPhone: "+7(910)911-3877",
  },
});

export { getEmailManager, type EmailManager };
