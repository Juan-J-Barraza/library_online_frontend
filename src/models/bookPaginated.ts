import { BookResponse } from "./bookResponse";

export interface BookPaginated {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: BookResponse[];
}