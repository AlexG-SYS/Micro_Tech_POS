// Item Data Model
export interface Items{
    id: string;
    categories: string[];
    upc: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    mpn: string;
    online: boolean;
    status: string;
    date: string;
}