import { fetchCompanyInfo, getQueryManager } from "@/lib/cqrs";
import {
  CacheKeys,
  CompanyInfoKeys,
  FailedResult,
  getCacheInfo,
  type Result,
} from "@/lib/domain";
import { getEmailManager } from "@/lib/email";
import { EmailSubjects } from "../const/messages";

const sendFailureEmail = async (message: string): Promise<Result> => {
  return getQueryManager()
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
      return getEmailManager().sendFailure({
        from: companyInfo.data[CompanyInfoKeys.CompanyEmail],
        to: companyInfo.data[CompanyInfoKeys.AdminEmail],
        subject: EmailSubjects.Failure,
        templateParams: { ...companyInfo.data, failureDescription: message },
      });
    })
    .catch((error) => FailedResult(error));
};

export { sendFailureEmail };
