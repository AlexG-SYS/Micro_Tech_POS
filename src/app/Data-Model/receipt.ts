import { Items } from "./item";

// Receipt Data Model
export interface Receipt {
    id: string;
    customerName: string;
    customerID: string;
    receiptNumber: number;
    reference: string;
    date: string;
    items: Partial<Items>[];
    total: number;
    paymentMeth: string;
    memo: string;
    salesRep: string;
}