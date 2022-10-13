import { ResponseBase } from "./response-base";

export class UserLoginDto {
    userId: number;
    username: string;
    forename: string;
    surname: string;
}

export class LoginRequest {
    username: string;
    password: string;
}

export class LoginResponse extends ResponseBase {
    sessionToken: string;
    user: UserLoginDto;
}

export class LogoutResponse extends ResponseBase {
}