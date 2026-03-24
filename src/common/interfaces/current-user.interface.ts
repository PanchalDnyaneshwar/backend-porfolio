import { Role } from '../enums/role.enum';

export interface CurrentUserInterface {
  userId: string;
  email: string;
  role: Role;
  name: string;
}
