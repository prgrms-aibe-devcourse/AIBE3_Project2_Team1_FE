export interface UserDto {
  accessToken: string;
  data: {
    item: {
      id: number;
      nickname: string;
      [key: string]: unknown;
    };
    apiKey: string;
    accessToken: string;
  };
  msg: string;
}

export interface UserRegisterRequestDto {
  email: string;
  password: string;
  nickname: string;
  name: string;
  phoneNumber: string;
  birthDate: string;
}

export interface UserUpdateRequestDto {
  nickname: string;
  name: string;
  phoneNumber: string;
  birthDate: string;
}

export interface UserPasswordChangeRequestDto {
  currentPassword: string;
  newPassword: string;
}
