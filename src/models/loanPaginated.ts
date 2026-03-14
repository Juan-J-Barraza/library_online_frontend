import { LoanResponse } from './loanResponse';

export interface LoanPaginated {
  data: LoanResponse[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}
