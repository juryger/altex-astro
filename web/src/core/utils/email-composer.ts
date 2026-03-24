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
import { getEmailManager, EmailSubjects } from "@/lib/email";
import { OrderTypes } from "../const";

interface EmailComposer {
  sendGeneralEmail(message: string, isFailure?: boolean): Promise<Result>;
  sendNewOrderEmail(checkoutId: number): Promise<Result>;
}

const getEmailComposer = (): EmailComposer => {
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
          return emailManager.sendGeneral({
            from: companyInfo.data[CompanyInfoKeys.CompanyEmail],
            to: companyInfo.data[CompanyInfoKeys.AdminEmail],
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
    sendNewOrderEmail: async (checkoutId: number) => {
      return Promise.all([
        queryManager.fetch(
          () => fetchCompanyInfo(),
          getCacheInfo(CacheKeys.CompanyInfo),
        ),
        queryManager.fetch(() => fetchCartCheckout(checkoutId)),
      ])
        .then(([companyInfo, cartCheckout]) => {
          if (!companyInfo.ok || companyInfo.data === undefined) {
            return FailedResult(
              companyInfo.error ??
                new Error(
                  "Could not obtain company info for email placeholders substitution.",
                ),
            );
          }
          if (!cartCheckout.ok || cartCheckout.data === undefined) {
            return FailedResult(
              cartCheckout.error ??
                new Error(
                  `Could not obtain cart items for checkout with ID #${checkoutId}.`,
                ),
            );
          }
          const orderNo = `${OrderTypes.Web}-${cartCheckout.data.root.id}`;
          const orderSum = cartCheckout.data?.items.reduce(
            (acc, curr) => acc + curr.quantity * curr.price,
            0,
          );
          const params = {
            orderNo,
            orderSum,
            orderSumLocal: formatCurrency(orderSum),
            items: cartCheckout.data.items,
            client: cartCheckout.data.guest,
          };
          return emailManager.sendNewOrder({
            from: companyInfo.data[CompanyInfoKeys.CompanyEmail],
            toCustomer: cartCheckout.data?.guest?.email ?? "",
            toBackOffice: companyInfo.data[CompanyInfoKeys.CompanyEmail],
            subject: `${EmailSubjects.NewOrder} #${orderNo}`,
            templateParams: { ...companyInfo.data, ...params },
          });
        })
        .then((result) => {
          return !result.ok
            ? FailedResult(
                result.error ?? new Error("Failed to send new order email"),
              )
            : OkResult();
        })
        .catch((err) => FailedResult(err));
    },
  };
};

export { getEmailComposer };
