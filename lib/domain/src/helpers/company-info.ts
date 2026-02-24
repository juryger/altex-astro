import { CompanyInfoKeys } from "../const/company-info";
import type { CompanyInfo } from "../models/company-info";

const parseCompanyInfo = (data: Array<CompanyInfo>): Record<string, string> => {
  const result: Record<string, string> = {};
  data.forEach((x) => {
    switch (x.name.toLowerCase()) {
      case CompanyInfoKeys.AdminEmail.toLowerCase():
        result[CompanyInfoKeys.AdminEmail] = x.value;
        break;
      case CompanyInfoKeys.ContactEmail.toLowerCase():
        result[CompanyInfoKeys.ContactEmail] = x.value;
        break;
      case CompanyInfoKeys.PhoneNumber.toLowerCase():
        result[CompanyInfoKeys.PhoneNumber] = x.value;
        break;
      case CompanyInfoKeys.Name.toLowerCase():
        result[CompanyInfoKeys.Name] = x.value;
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
