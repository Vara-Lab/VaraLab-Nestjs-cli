import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TrafficLightService } from './trafficlight.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
@Controller('trafficlight')
export class TrafficLightController {
    constructor(private trafficlightService: TrafficLightService) {}
    @UseGuards(JwtGuard)
    @Post('command/green')
    async green(@Body() data: any) {
        return this.trafficlightService.greenCall(data.user.sub);
    }
    @UseGuards(JwtGuard)
    @Post('command/randomfunccommand')
    async randomfunccommand(@Body() data: any) {
        return this.trafficlightService.randomfunccommandCall(data.user.sub, data.callArguments);
    }
    @UseGuards(JwtGuard)
    @Post('command/red')
    async red(@Body() data: any) {
        return this.trafficlightService.redCall(data.user.sub);
    }
    @UseGuards(JwtGuard)
    @Post('command/yellow')
    async yellow(@Body() data: any) {
        return this.trafficlightService.yellowCall(data.user.sub);
    }
    @Get('query/contractowner')
    async contractowner() {
        return this.trafficlightService.contractownerCall();
    }
    @Get('query/randomfuncquery')
    async randomfuncquery(@Body() data: any) {
        return this.trafficlightService.randomfuncqueryCall(data.callArguments);
    }
    @Get('query/trafficlight')
    async trafficlight() {
        return this.trafficlightService.trafficlightCall();
    }
}