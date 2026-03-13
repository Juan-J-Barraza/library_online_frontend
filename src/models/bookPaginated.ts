import { BookResponse } from "./bookResponse";

export interface BookPaginated {  // asi debes crear los paginados y usas lo que viene de data
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: BookResponse[];
}