import { Injectable, Logger } from "@nestjs/common";
import { CreatePollsDataType, JoinPollsDataType, RejoinPollDataType } from "./polls.types";
import { createUniquePollID, createUniqueUserID } from "src/uniqueIds";
import { PollsRepository } from "./polls.repository";

@Injectable()
export class PollsService {
    private readonly logger = new Logger(PollsService.name)
    constructor(private readonly pollsRepository: PollsRepository) { }
    async createPoll(createPollsData: CreatePollsDataType) {
        const pollID = createUniquePollID()
        const userID = createUniqueUserID()
        const createPoll = await this.pollsRepository.createPoll({
            ...createPollsData,
            userID,
            pollID
        })
        return {
            poll: createPoll
        }
    }

    async joinPoll(joinPollsData: JoinPollsDataType) {

        const userID = createUniqueUserID()
        this.logger.debug(
            `Fetching poll with ID: ${joinPollsData.pollID} for user with ID: ${userID}`

        )
        const joinedPoll = await this.pollsRepository.getPoll(joinPollsData.pollID)

        return {
            poll: joinedPoll
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