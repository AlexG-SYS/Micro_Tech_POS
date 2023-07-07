export interface payments {
  id: string;
  fullName: string;
  accountID: string;
  salesRep: string;
  date: string;
  paymentMethod: string;
  paymentAmount: number;
  unappliedAmount: number;
  reference: string;
  memo: string;
  appliedTo: Partial<{
    invoiceNumber: number;
    date: string;
    salesRep: string;
  }>[];
}
