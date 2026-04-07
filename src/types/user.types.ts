import { UserRole } from "../lib/authUtilts";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
