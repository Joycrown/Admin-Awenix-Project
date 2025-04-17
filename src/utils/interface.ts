export interface userProps {
  accessToken: string;
  refreshToken: string;
  name: string;
  userType: string;
  isLogged: boolean;
  id: string;
}

export interface adminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  admin_status: string;
  user_type: string;
  isDeleting:boolean;
  created_at: Date;
  isChanging: boolean;
}

export interface productProps {
  name: string;
  description: string;
  price: number;
  product_image: string;
  removed: boolean;
  size: string;
  last_edited_by: string;
  updated_at: string;
}


export interface productPopProps extends Omit<productProps, "last_edited_by" | "updated_at"> { }

export interface orderProduct {
  product_id: number;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  price_per_unit: number;
  miscellaneous:number,
  total_price: number;
}


export interface orderCustomItem {
  product_name:string
  quantity: number;
}


export interface PaymentOut {
  payment_option: string
  bank: string
  payee_name: string
  delivery_person: string
  amount_paid: number
}


export interface orderProps {
  order_id: string;
  total_price: number;
  customer: string;
  customer_details: {
    id: string;
    email: string;
    name: string;
    phone_no: string;
    user_type: string;
  };
  created_at: string;
  expire_at: string;
  status: string;
  user_receipt_url: string;
  user_bank_verification:string
  user_payment_name: string
  order_items: orderProduct[],
  custom_order_items: orderCustomItem[]
  payment_reference?: string;
  order_verified_by?: string;
  payment: PaymentOut
}



export interface ServiceProps {
  id: number;
  name: string;
  description: string;
  price: number;
  created_by: string;
  last_edited_by?: string;
  created_at: string;
  updated_at: string;
  removed: boolean;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
}