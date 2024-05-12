import { Injectable, Logger } from "@nestjs/common";
import { CreatePollsDataType, JoinPollsDataType, RejoinPollDataType } from "./polls.types";
import { createUniquePollID, createUniqueUserID } from "src/uniqueIds";
import { PollsRepository } from "./polls.repository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PollsService {
    private readonly logger = new Logger(PollsService.name)
    constructor(private readonly pollsRepository: PollsRepository,
        private readonly jwtService : JwtService
    ) { }
    async createPoll(createPollsData: CreatePollsDataType) {
        const pollID = createUniquePollID()
        const userID = createUniqueUserID()
        const createPoll = await this.pollsRepository.createPoll({
            ...createPollsData,
            userID,
            pollID
        })

        this.logger.debug(`Creating token string for pollID: ${createPoll.id} and userID: ${userID}`)

        const signedString = this.jwtService.sign({
            pollID : createPoll.id,
            userName : createPollsData.userName,
        },{
            subject : userID
        })



        return {
            poll: createPoll,
            accessToken : signedString
        }
    }

    async joinPoll(joinPollsData: JoinPollsDataType) {

        const userID = createUniqueUserID()
        this.logger.debug(
            `Fetching poll with ID: ${joinPollsData.pollID} for user with ID: ${userID}`

        )
        const joinedPoll = await this.pollsRepository.getPoll(joinPollsData.pollID)

        this.logger.debug(`Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`)

        const signedString = this.jwtService.sign({
            pollID : joinedPoll.id,
            userName : joinPollsData.userName,
        },{
            subject : userID
        })



        return {
            poll: joinedPoll,
            accessToken : signedString
        }
      
    }

    async rejoinPoll(rejoinPollsData: RejoinPollDataType) {
        this.logger.debug(
            `Rejoining poll with ID: ${rejoinPollsData.pollID} for user with ID: ${rejoinPollsData.userID} with name: ${rejoinPollsData.userName}`

        )
        const joinedPoll = await this.pollsRepository.addParticipant(rejoinPollsData)
        return joinedPoll
    }

}