import { ReservationResponse } from "./ReservationResponse";

export interface ReservationPaginated {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: ReservationResponse[];
}
