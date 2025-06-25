export class SafeUserDto {
  id: string;
  email: string;
  name: string | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
