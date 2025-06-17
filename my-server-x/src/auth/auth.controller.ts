import { Body, Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
// import { CreateUserDto } from 'src/user/dto/dto/user.dto';
import { CreateKeyringDto } from 'src/keyring/dto/create-keyring.dto';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { KeyringService } from 'src/keyring/keyring.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private keyringService: KeyringService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateKeyringDto) {
    console.log('se a registrado!');
    return await this.keyringService.createKeyring(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    console.log('a iniciado sesion!');
    return await this.authService.login(dto, res);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log('A refrescado!');
    return await this.authService.refreshToken(req.user, res);
  }
}
