import { Items } from "./item";

// Receipt Data Model
export interface Receipt {
    id: string;
    customerName: string;
    receiptNumber: number;
    date: string;
    items: Partial<Items>[];
    paymentMeth: string;
    memo: string;
}