import { BookResponse } from "./bookResponse";

export interface LibroResponse {

  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: BookResponse[];

}