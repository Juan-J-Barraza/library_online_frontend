import { UserResponse } from './userResponse';
import { BookResponse } from './bookResponse';

export interface LoanResponse {
  id: number;
  user: UserResponse;
  book: BookResponse;
  status: string;
  quantity: number;
  reservation_date: string;
  borrowed_date?: string | null;
  expected_return_date?: string | null;
  actual_return_date?: string | null;
}
