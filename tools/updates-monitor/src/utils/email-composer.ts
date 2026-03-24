import {
  fetchCompanyInfo,
  fetchCartCheckout,
  getQueryManager,
} from "@/lib/cqrs";
import {
  CacheKeys,
  CompanyInfoKeys,
  FailedResult,
  formatCurrency,
  getCacheInfo,
  OkResult,
  type Result,
} from "@/lib/domain";
import { EmailSubjects, getEmailManager } from "@/lib/email";
import type { EmailComposer } from "../core";

export const getEmailComposer = (): EmailComposer => {
  const queryManager = getQueryManager();
  const emailManager = getEmailManager();
  return {
    sendGeneralEmail: async (
      message: string,
      isFailure: boolean = false,
    ): Promise<Result> => {
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
