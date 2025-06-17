import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { KeyringService } from 'src/keyring/keyring.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private keyringService: KeyringService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, res: Response) {
    const keyringSessionData = await this.validateUser(dto);

    const payload = {
      username: keyringSessionData.username,
      sub: {
        keyringAddress: keyringSessionData.keyringAddress,
        keyringVoucherId: keyringSessionData.keyringVoucherId,
        lockedKeyringData: keyringSessionData.lockedKeyringData,
        password: keyringSessionData.password
      },
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.jwtSecretKey,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.jwtRefreshTokenKey,
    });

    const expiresIn = new Date().setTime(new Date().getTime() + EXPIRE_TIME);

    // Set cookies
    res.cookie('varaAccessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * (60 * 1000),
    });

    res.cookie('varaRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * (60 * 1000),
    });


    return {
      user: {
        name: keyringSessionData.username,
        id: keyringSessionData.keyringAddress,
      }
    };
  }

  async validateUser(dto: LoginDto) {
    const { username, password } = dto;
    const keyringAddress = await this.keyringService.userKeyringAddress(username);
    if (!keyringAddress) {
      throw new UnauthorizedException();
    }
    
    const keyringSessionData = await this.keyringService.userKeyringData(
      keyringAddress,
      username,
      password
    );

    return keyringSessionData;
  }

  async refreshToken(user: any, res: Response) {
    const payload = {
      username: user.username,
      sub: user.sub
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.jwtSecretKey,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.jwtRefreshTokenKey,
    });


    res.cookie('varaAccessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * (60 * 1000),
    });

    res.cookie('varaRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * (60 * 1000),
    });


    return {
      user: {
        name: user.username,
        id: user.sub.keyringAddress
      }
    };
  }
}
