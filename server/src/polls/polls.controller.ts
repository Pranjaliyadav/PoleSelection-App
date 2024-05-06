import { Body, Controller, Logger, Post } from "@nestjs/common";
import { CreatePollsDto, JoinPollsDto } from "./polls.dtos";

@Controller('polls')
export class PollsController {
    @Post()
    async createPolls(@Body() createPollsDto : CreatePollsDto ) {
        Logger.log('In create');
        return createPollsDto
    }

    @Post('/join')
    async joinPolls(@Body() joinPollsDto : JoinPollsDto) {
        Logger.log('In Join');
        return joinPollsDto
    }

    @Post('/rejoin')
    async rejoinPolls() {
        Logger.log('In Rejoin');
    }
}