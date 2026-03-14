import { AuthorResponse } from "./authorResponse";
import { EditorialResponse } from "./editorialResponse";

export interface BookResponse {
  id: number;
  title: string;
  available_quantity: number;
  total_quantity: number;
  image: string;
  editorial: EditorialResponse;
  authors: AuthorResponse[];
  created_at: string;
}