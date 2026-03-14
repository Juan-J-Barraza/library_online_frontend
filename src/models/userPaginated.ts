import { UserResponse } from "./userResponse";

export interface UserPaginated {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: UserResponse[];
}
