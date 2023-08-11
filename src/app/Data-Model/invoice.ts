import { Items } from './item';

// Invoice Data Model
export interface Invoice {
  id: string;
  customerName: string;
  customerID: string;
  invoiceNumber: number;
  date: string;
  items: Partial<Items>[];
  subtotal: number;
  discount: number;
  discountPercentage: number;
  TAX: number;
  total: number;
  memo: string;
  salesRep: string;
}
