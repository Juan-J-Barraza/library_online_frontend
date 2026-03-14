export interface CreateOrUpdateBookRequest {
  title: string;
  available_quantity: number;
  total_quantity: number;
  image: string;
  editorial_id: number;
  author_ids: number[];
}
