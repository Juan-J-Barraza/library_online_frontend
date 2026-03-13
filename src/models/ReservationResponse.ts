import { UserResponse } from "./userResponse";
import { BookResponse } from "./bookResponse";

export interface ReservationResponse {

  id: number;
  user: UserResponse;
  book: BookResponse;
  status: string;
  quantity: number;
  reservation_date: string;
  expected_return_date?: string;

}