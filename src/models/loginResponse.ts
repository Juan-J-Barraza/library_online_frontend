import { UserResponse } from "./userResponse";

export interface LoginResponse {
  token: string;
  user: UserResponse;
}
