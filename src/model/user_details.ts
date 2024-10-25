export interface UserResponse {
  accessToken: string;
  tokenType: string;
  userDetails: UserDetails;
}

export interface UserDetails {
  userInfoId: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isActive: boolean;
  isLoggedIn: number;
  issuedAt: string;
}
