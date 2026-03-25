import {
  CacheKeys,
  CompanyInfoKeys,
  EnvironmentNames,
  FailedResult,
  getCacheInfo,
  regexTrue,
  selectEnvironment,
  type Result,
} from "@/lib/domain";
import { fetchCompanyInfo, getQueryManager } from "@/lib/cqrs";
import { EmailSubjects, getEmailManager } from "@/lib/email";
import type { EmailComposer } from "../core";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

export const getEmailComposer = (): EmailComposer => {
  const queryManager = getQueryManager();
  const emailManager = getEmailManager();
  return {
    sendGeneralEmail: async (
      message: string,
      isFailure: boolean = false,
    ): Promise<Result> => {
      withTracing &&
        console.log(
          "🐾 ~ email-composer ~ send general email with message '%s' and failure flag '%s'",
          message,
          isFailure,
        );
      return queryManager
        .fetch(() => fetchCompanyInfo(), getCacheInfo(CacheKeys.CompanyInfo))
        .then((companyInfo) => {
          if (!companyInfo.ok || companyInfo.data === undefined) {
            return FailedResult(
              companyInfo.error ??
                new Error(
                  "Could not obtain company info for email placeholders substitution",
                ),
            );
          }
          const fromEmail = companyInfo.data[CompanyInfoKeys.CompanyEmail];
          const toEmail = companyInfo.data[CompanyInfoKeys.AdminEmail];
          if (fromEmail === undefined || toEmail === undefined) {
            return FailedResult(
              new Error(
                "CompanyEmail and AdminEmail are missed in companyInfo data",
              ),
            );
          }
          withTracing &&
            console.log(
              "🐾 ~ email-composer ~ before send, from: '%s', to: '%s', companyInfo: %o",
              fromEmail,
              toEmail,
              companyInfo,
            );
          return emailManager.sendGeneral({
            from: fromEmail,
            to: toEmail,
            subject: isFailure ? EmailSubjects.Failure : EmailSubjects.Success,
            templateParams: isFailure
              ? {
                  ...companyInfo.data,
                  failureDescription: message,
                }
              : {
                  ...companyInfo.data,
                  successDescription: message,
                },
          });
        })
        .catch((error) => FailedResult(error));
    },
  };
};
