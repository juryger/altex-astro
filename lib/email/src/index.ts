import path from "path";
import fs_sync from "fs";
import fs from "fs/promises";
import Handlebars from "handlebars";
import type { Result } from "@/lib/domain";
import {
  EnvironmentNames,
  FailedResult,
  getErrorMessage,
  OkResult,
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
  const withTracing = regexTrue.test(
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
      withTracing &&
        console.log("🐾 ~ email service ~ New Order email: %o", {
          toCustomer,
          subject,
          templateParams,
        });

      return Promise.all([
        prepareTemplate({
          rootPath: selectEnvironment(EnvironmentNames.EMAIL_TEMPLATES_PATH),
          fileName: EmailTemplates.NewOrder,
          params: templateParams,
        }),
        prepareTemplate({
          rootPath: selectEnvironment(EnvironmentNames.EMAIL_TEMPLATES_PATH),
          fileName: XmlTEmplates.NewOrder,
          params: templateParams,
        }),
      ])
        .then(async ([emailContent, xmlContent]) => {
          try {
            const [customerEmail, backOfficeEmail] = await Promise.all([
              transport.sendEmail({
                from,
                to: toCustomer,
                subject,
                content: emailContent,
              }),
              transport.sendEmail({
                from,
                to: toBackOffice,
                subject,
                content: emailContent,
                attachmentContent: xmlContent,
              }),
            ]);
            return !customerEmail.ok || !backOfficeEmail.ok
              ? FailedResult(
                  customerEmail.error ??
                    backOfficeEmail.error ??
                    new Error("Failed to send new order email."),
                )
              : OkResult();
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            return FailedResult(new Error(errorMessage));
          }
        })
        .catch((error) => FailedResult(error));
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
      withTracing &&
        console.log("🐾 ~ emailService ~ Failure email: %o", {
          to,
          subject,
          templateParams,
        });
      return prepareTemplate({
        rootPath: selectEnvironment(EnvironmentNames.EMAIL_TEMPLATES_PATH),
        fileName: EmailTemplates.Failure,
        params: templateParams,
      })
        .then(async (content) => {
          try {
            const result = await transport.sendEmail({
              from,
              to,
              subject,
              content,
            });
            return !result.ok
              ? FailedResult(
                  new Error(
                    "Failed to send email to admin regarding tehcnical issue.",
                  ),
                )
              : OkResult();
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            return FailedResult(new Error(errorMessage));
          }
        })
        .catch((error) => FailedResult(error));
    },
  };
};

export { getEmailManager, type EmailManager };
