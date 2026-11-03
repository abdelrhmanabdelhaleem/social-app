// Interface for user registration request payload
export interface ISignupRequest {
  name: string;
  username?: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  password: string;
  rePassword: string;
}

// Interface for user signin request payload
export interface ISigninRequest {
  email: string;
  password: string;
}

// Interface for user registration/signin response structure
export interface ISignupResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    tokenType: string;
    expiresIn: string;
    user: {
      _id: string;
      name: string;
      username: string;
      email: string;
      photo: string;
      cover: string;
    };
  };
  errors?: string;
}
