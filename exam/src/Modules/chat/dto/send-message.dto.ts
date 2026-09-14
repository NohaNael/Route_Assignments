import { IsString, IsNotEmpty, IsMongoId } from "class-validator";

export class SendMessageDto {
  @IsMongoId()
  receiverId!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
