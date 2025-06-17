import { Module } from '@nestjs/common';
import { TrafficLightController } from './trafficlight.controller';
import { TrafficLightService } from './trafficlight.service';
import { SailscallsService } from 'src/sailscallsClientService/sailscallsClient.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TrafficLightController],
  providers: [TrafficLightService, SailscallsService, JwtService]
})
export class TrafficLightModule {}