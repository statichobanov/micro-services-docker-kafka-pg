export interface OrderPayload {
  id: string;
  id_user: string;
  status: string;

  products: { id_product: string; quantity: number }[];
}
