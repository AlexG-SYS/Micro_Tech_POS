import { payments } from './payments';

// Account Data Model
export interface Account {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city_town_village: string;
  country: string;
  balance: number;
  status: string;
  date: string;
}
