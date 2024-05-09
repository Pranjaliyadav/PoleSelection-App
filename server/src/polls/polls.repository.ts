import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { IORedisKey } from "src/redis.module";
import { AddParticipantData, CreatePollData } from "./polls.types";
import { Poll } from 'shared'
//provie this repo as provider to polls module
@Injectable()
export class PollsRepository {
    private readonly ttl: string; //to use time-to-live from configuration, how logn polls should exists beased on environment
    private readonly logger = new Logger(PollsRepository.name)

    constructor(
        configService: ConfigService,
        @Inject(IORedisKey) private readonly redisClient: Redis,

    ) {
        this.ttl = configService.get('POLL_DURATION')
    }

    async createPoll({
        votesPerVoter,
        topic,
        pollID, userID,
    }: CreatePollData): Promise<Poll> {
        const initialPoll = {
            id: pollID,
            topic,
            votesPerVoter,
            participants: {},
            adminID: userID
        }

        this.logger.log(`Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${this.ttl}`)

        const key = `polls:${pollID}`
        try {
            await this.redisClient.multi([
                ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
                ['expire', key, this.ttl],

            ])
                .exec()
            return initialPoll
        }
        catch (e) {
            this.logger.error(
                `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
            )
            throw new InternalServerErrorException()
        }
    }

    async getPoll(pollID: string): Promise<Poll> {
        this.logger.log(`Attempting to get poll with: ${pollID}`)
        const key = `polls:${pollID}`
        try {
            const currentPoll = await this.redisClient.send_command(
                'JSON.GET',
                key,
                '.',

            )
            this.logger.verbose(currentPoll)
            // if (currentPoll?.hasStarted) {
            //   throw new BadRequestException('The poll has already started');
            // }
            return JSON.parse(currentPoll)
        }
        catch (e) {
            this.logger.error(`Failed to get pollID ${pollID}`)
            throw e
        }
    }

    async addParticipant({
        pollID,
        userID,
        userName,

    }:AddParticipantData): Promise<Poll>{
        this.logger.log(`Attempting to add a participants with userID/name: ${userID}/${name} to pollID: ${pollID}`)

        const key = `poll:${pollID}`
        const participantPath = `.participants.${userID}`

        try{
            await this.redisClient.send_command(
                'JSON.SET',
                key,
                participantPath,
                JSON.stringify(name),
            )

            const pollJSON = await this.redisClient.send_command(
                'JSON.GET',
                key,
                '.',
            )
            const poll = JSON.parse(pollJSON) as Poll;
            this.logger.debug(
                `Current Partipants for pollID: ${pollID}`,
                poll.participants,
            )

            return poll
        }
        catch(e){
            this.logger.error(
                this.logger.error(`Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`)
            )
            throw e;
        }
    }
}