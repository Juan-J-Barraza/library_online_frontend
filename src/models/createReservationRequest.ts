export interface CreateReservationRequest {
  book_id: number;
  quantity: number;
  user_id?: number;
  expected_return_date?: string;
}
