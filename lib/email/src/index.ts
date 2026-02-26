import path from "path";
import fs_sync from "fs";
import fs from "fs/promises";
import Handlebars from "handlebars";
import type { Result } from "@/lib/domain";
import {
  EnvironmentNames,
  getErrorMessage,
  regexTrue,
  selectEnvironment,
} from "@/lib/domain";
import { getEmailTransport } from "./transport";

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

type EmailManager = {
  sendNewOrder: ({
    from,
    toCustomer,
    toBackOffice,
    subject,
    templateParams,
  }: {
    from: string;
    toCustomer: string;
    toBackOffice: string;
    subject: string;
    templateParams?: Record<string, any>;
  }) => Promise<Result>;
  sendFailure: ({
    from,
    to,
    subject,
    templateParams,
  }: {
    from: string;
    to: string;
    subject: string;
    templateParams?: Record<string, string>;
  }) => Promise<Result>;
};

const getEmailManager = (): EmailManager => {
  const isTracingEnabled = regexTrue.test(
    selectEnvironment(EnvironmentNames.ENABLE_TRACING),
  );
  const transport = getEmailTransport();
  return {
    sendNewOrder: async ({
      from,
      toCustomer,
      toBackOffice,
      subject,
      templateParams,
    }: {
      from: string;
      toCustomer: string;
      toBackOffice: string;
      subject: string;
      templateParams?: Record<string, any>;
    }): Promise<Result> => {
      if (isTracingEnabled) {
        console.log("🐾 ~ email service ~ New Order email: %o", {
          toCustomer,
          subject,
          templateParams,
        });
      }

      try {
        const content = await prepareTemplate({
          rootPath: selectEnvironment(EnvironmentNames.EMAIL_TEMPLATES_PATH),
          fileName: EmailTemplates.NewOrder,
          params: templateParams,
        });

        const customerEmail = await transport.sendEmail({
          from,
          to: toCustomer,
          subject,
          content,
        });
        if (customerEmail.status !== "Ok") {
          return { status: "Failed", error: customerEmail.error };
        }

        const xmlContent = await prepareTemplate({
          rootPath: selectEnvironment(EnvironmentNames.EMAIL_TEMPLATES_PATH),
          fileName: XmlTEmplates.NewOrder,
          params: templateParams,
        });

        return await transport.sendEmail({
          from,
          to: toBackOffice,
          subject,
          content,
          attachmentContent: xmlContent,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "Cannot send 'New Order' email, see more details below. %s",
          errorMessage,
        );
        return { status: "Failed", error: new Error(errorMessage) };
      }
    },
    sendFailure: async ({
      from,
      to,
      subject,
      templateParams,
    }: {
      from: string;
      to: string;
      subject: string;
      templateParams?: Record<string, any>;
    }): Promise<Result> => {
      if (isTracingEnabled) {
        console.log("🐾 ~ emailService ~ Failure email: %o", {
          to,
          subject,
          templateParams,
        });
      }

      try {
        const content = await prepareTemplate({
          rootPath: selectEnvironment(EnvironmentNames.EMAIL_TEMPLATES_PATH),
          fileName: EmailTemplates.Failure,
          params: templateParams,
        });

        return await transport.sendEmail({
          from,
          to,
          subject,
          content,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "Cannot send 'Failurer' email, see more details below. %s",
          errorMessage,
        );
        return { status: "Failed", error: new Error(errorMessage) };
      }
    },
  };
};

export { getEmailManager, type EmailManager };
