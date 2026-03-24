import { type Result } from "@/lib/domain";

// Values correspondes to template file names (*.html)
enum EmailTemplates {
  NewOrder = "new-order.html",
  Failure = "failure.html",
}

enum XmlTEmplates {
  NewOrder = "new-order.xml",
}

interface EmailManager {
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
  sendGeneral: ({
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
}

export { EmailTemplates, XmlTEmplates, type EmailManager };
