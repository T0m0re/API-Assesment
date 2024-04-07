import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { AuthServices } from './auth.service';
import { AuthDtoCreate, AuthDtoDelete, AuthUpdate } from './dto/createUser';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('register')
  registerNewUser(@Body() dto: AuthDtoCreate) {
    return this.authService.registerNewUser(dto);
  }

  @Patch('update')
  updateUser(@Body() dto: AuthUpdate) {
    return this.authService.updateUser(dto);
  }

  @Delete('delete')
  deleteUser(@Body() dto: AuthDtoDelete) {
    return this.authService.deleteUser(dto);
  }
}
