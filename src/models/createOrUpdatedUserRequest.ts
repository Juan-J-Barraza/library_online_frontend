export interface CreateOrUpdatedUserRequest {
  name: string;
  last_name: string;
  email: string;
  password?: string;
  role: 'PROFESOR' | 'ESTUDIANTE' | 'ADMIN';
}
