import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeyringService } from 'src/keyring/keyring.service';
import { SailscallsService } from 'src/sailscallsClientService/sailscallsClient.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig)
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtService, 
    KeyringService,
    SailscallsService
  ],
})
export class AuthModule {}
