export const Invoices = {
  get: (Id: string) => `/api/invoices/${Id}/`,
  update: (Id: string) => `/api/invoices/${Id}/`,
  delete: (Id: string) => `/api/invoices/${Id}/`,
  updateItems: (Id: string) => `/api/invoices/${Id}/items/`,
  updateState: (Id: string) => `/api/invoices/${Id}/state/`,
  create: "/api/invoices/",
  list: "/api/invoices/",
};

export const Providers = {
  create: "/api/providers/",
  list: "/api/providers/",
};