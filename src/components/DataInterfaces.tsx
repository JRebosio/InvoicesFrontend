export interface Provider {
  id: string;
  name: string;
  address: string;
  phone_number: string;
}

export const ROLES = {
  APPROVER: "APPROVER",
  PLACER: "PLACER",
};

export const INVOICES_STATES = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
};

export interface Item {
  name: string;
  quantity: string;
  price: string;
}

export interface Invoice {
  id: string;
  user: string;
  provider: string;
  state: string;
  total_cost: string;
  items: Item[];
}
