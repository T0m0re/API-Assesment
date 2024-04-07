import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDtoCreate, AuthDtoDelete, AuthUpdate } from './dto/createUser';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthServices {
  constructor(private prisma: PrismaService) {}

  async registerNewUser(dto: AuthDtoCreate) {
    // Generate hashed password
    const hashPassword = await argon.hash(dto.password);

    function generateRandomNumber(): number {
      // Generate a random number between 1000000 and 9999999
      const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;

      // Convert the random number to a string
      const randomNumberString = '012' + randomNumber.toString();

      // Convert the string back to a number
      const randomNumberWithPrefix = parseInt(randomNumberString);

      return randomNumberWithPrefix;
    }

    // Save new user in database
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          accountNumber: generateRandomNumber(),
        },
      });

      delete newUser.hashPassword;

      return newUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User Already Exist');
        }
      }
      throw error;
    }
  }

  async updateUser(dto: AuthUpdate) {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          id: dto.userId,
        },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      console.log('Data updated successfully:', updateUser);
      return updateUser;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(dto: AuthDtoDelete) {
    try {
      // Assuming userId is the unique ID of the user to be deleted
      const userId = dto.id;
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      console.log('user delete');
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('User Does Not Exist In Database');
        }
      }
    }
  }
}
