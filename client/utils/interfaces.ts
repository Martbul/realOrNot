import { Dispatch, SetStateAction } from "react";

export interface User {
  //username: string;
  //email: string | undefined;
  id: string
}

export interface AuthContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}
