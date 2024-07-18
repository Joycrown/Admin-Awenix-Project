export interface userProps {
  accessToken: string;
  refreshToken: string;
  name: string;
  userType: string;
  isLogged: boolean;
  id: string;
}

export interface productProps {
  name: string;
  description: string;
  price: number;
  product_image: string;
  size: string;
  last_edited_by: string;
  updated_at: string;
}


export interface productPopProps extends Omit<productProps, "last_edited_by" | "updated_at"> {}

export interface orderProduct {
  product_id: number;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  price_per_unit: number;
  total_price: number;
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
  order_items: orderProduct[],
}