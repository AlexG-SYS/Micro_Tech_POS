export interface payments {
    id: string;
    accountID: string;
    salesRep: string;
    date: string,
    paymentMethod: string;
    paymentAmount: number,
    unappliedAmount: number,
    reference: string;
    memo: string;
    appliedTo: Partial<{invoiceNumber: number, date: string, salesRep: string}>[];
}