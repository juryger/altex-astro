import { CompanyInfoKeys } from "../const/company-info";
import type { CompanyInfo } from "../models/company-info";

const parseCompanyInfo = (data: Array<CompanyInfo>): Record<string, string> => {
  const result: Record<string, string> = {};
  data.forEach((x) => {
    switch (x.name.toLowerCase()) {
      case CompanyInfoKeys.AdminEmail.toLowerCase():
        result[CompanyInfoKeys.AdminEmail] = x.value;
        break;
      case CompanyInfoKeys.CompanyEmail.toLowerCase():
        result[CompanyInfoKeys.CompanyEmail] = x.value;
        break;
      case CompanyInfoKeys.CompanyPhone.toLowerCase():
        result[CompanyInfoKeys.CompanyPhone] = x.value;
        break;
      case CompanyInfoKeys.CompanyName.toLowerCase():
        result[CompanyInfoKeys.CompanyName] = x.value;
        break;
      case CompanyInfoKeys.CompanyWeb.toLowerCase():
        result[CompanyInfoKeys.CompanyWeb] = x.value;
        break;
      default:
        result[x.name] = x.value;
        break;
    }
  });
  return result;
};

export { parseCompanyInfo };
