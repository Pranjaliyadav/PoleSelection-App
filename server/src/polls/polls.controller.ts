import { Body, Controller, Post } from "@nestjs/common";
import { CreatePollsDto, JoinPollsDto } from "./polls.dtos";
import { PollsService } from "./polls.service";

@Controller('polls')
export class PollsController {

    constructor(private pollsService: PollsService) { } //add service here, to use its methods

    @Post()
    async createPolls(@Body() createPollsDto: CreatePollsDto) {
        const result = await this.pollsService.createPoll(createPollsDto)

        return result
    }

    @Post('/join')
    async joinPolls(@Body() joinPollsDto: JoinPollsDto) {
        const result = await this.pollsService.joinPoll(joinPollsDto)

        return result
    }

    @Post('/rejoin')
    async rejoinPolls() {
        const result = await this.pollsService.rejoinPoll({
            userName: 'Hel',
            pollID: 'edhhs',
            userID: 'ewhshhsh'
        })

        return result
    }
}