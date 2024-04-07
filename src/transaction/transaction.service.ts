import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDtoCreate } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  async newTransaction(senderId: string, dto: TransactionDtoCreate) {
    try {
      const { amount, receivermail, type } = dto;

      //   Retrieve sender's account from the database
      const senderAccount = await this.prisma.user.findUnique({
        where: { id: senderId },
      });
      if (!senderAccount) {
        throw new Error('Sender account not found');
      }

      // Retrieve receiver's account from the database
      const receiverAccount = await this.prisma.user.findUnique({
        where: { email: receivermail },
      });

      if (!receiverAccount) {
        throw new Error('Receiver account not found');
      }

      //   Check if sender and receiver are not the same

      if (receiverAccount.id === senderAccount.id) {
        throw new Error('Sender and receiver cant be the same');
      }

      // Update sender's account balance
      if (type == 'WITHDRAWAL') {
        if (senderAccount.balance < amount) {
          throw new Error('Insufficient balance');
        }
        senderAccount.balance -= amount;
      }

      // Update receiver's account balance
      if (type == 'DEPOSIT') {
        receiverAccount.balance += amount;
      }

      // Saving the updated balances
      await this.prisma.user.update({
        where: { id: senderId },
        data: { balance: senderAccount.balance },
      });

      await this.prisma.user.update({
        where: { email: receivermail },
        data: { balance: receiverAccount.balance },
      });

      //   Save transaction to database
      const transaction = await this.prisma.transaction.create({
        data: {
          amount: dto.amount,
          senderId: senderId,
          receivermail: dto.receivermail,
          type: dto.type,
        },
      });

      return transaction;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        senderId: userId, // Assuming transactions for a user are stored based on senderId
      },
    });
  }
}
