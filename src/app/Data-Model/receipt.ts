import { Items } from "./item";

// Receipt Data Model
export interface Receipt {
    id: string;
    customerName: string;
    receiptNumber: number;
    date: string;
    items: Partial<Items>[];
    total: number;
    paymentMeth: string;
    memo: string;
}