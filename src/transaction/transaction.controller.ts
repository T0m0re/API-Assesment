import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDtoCreate } from './dto/transaction.dto';

@Controller('transfer')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get(':userId')
  async getUserTransactions(@Param('userId') userId: string) {
    return this.transactionService.getUserTransactions(userId);
  }

  @Post('send:senderId')
  newTransaction(
    @Param('senderId') senderId: string,
    @Body() dto: TransactionDtoCreate,
  ) {
    return this.transactionService.newTransaction(senderId, dto);
  }
}
