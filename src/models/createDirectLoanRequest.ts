export interface CreateDirectLoanRequest {
  user_id: number;
  book_id: number;
  quantity: number;
  expected_return_date?: string | null;
}
