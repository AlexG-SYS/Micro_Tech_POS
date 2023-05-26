// Item Data Model
export interface Items {
    id: string;
    categories: string[];
    upc: string;
    description: string;
    itemSubTotal: number;
    itemTax: number;
    cost: number;
    price: number;
    quantity: number;
    size: string;
    image: string;
    tax: boolean;
    online: boolean;
    status: string;
    date: string;
}