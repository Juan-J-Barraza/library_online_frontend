import { EditorialResponse } from "./editorialResponse";
import { AuthorResponse } from "./authorResponse";

export interface BookResponse {
  id: number;
  title: string;
  available_quantity: number;
  total_quantity: number;
  image: string; // esto debe ser en Base64
  editorial: EditorialResponse;
  authors: AuthorResponse[];
  created_at: Date;
}