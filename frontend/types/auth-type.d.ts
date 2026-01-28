export namespace AuthProps {
  export interface LoginType {
    username: string
    password: string
  }
  export interface RegisterType {
    username: string
    password: string
    confirmPassword: string
    email: string
    firstName: string
    lastName: string
  }
  export interface SearchUserType {
    id: string
    firstName: string
    lastName: string
  }
}