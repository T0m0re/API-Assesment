import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionDtoCreate {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  receivermail: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
