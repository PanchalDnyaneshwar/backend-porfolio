import { IsEmail } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;
}