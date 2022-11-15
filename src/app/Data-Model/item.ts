// Item Data Model
export interface Items{
    id: string;
    category: string;
    upc: string;
    description: string;
    itemSubTotal: number;
    itemTax: number;
    price: number;
    quantity: number;
    image: string;
    mpn: string;
    tax: boolean;
    online: boolean;
    status: string;
    date: string;
}