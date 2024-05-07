import { Injectable } from "@nestjs/common";
import { CreatePollsDataType, JoinPollsDataType, RejoinPollDataType } from "./polls.types";
import { createUniquePollID, createUniqueUserID } from "src/uniqueIds";

@Injectable()
export class PollsService {

    async createPoll(createPollsData  : CreatePollsDataType){
        const pollID = createUniquePollID()
        const userID = createUniqueUserID()

        return {
            ...createPollsData,
            userID,
            pollID
        }
    }

    async joinPoll(joinPollsData  : JoinPollsDataType){
        
        const userID = createUniqueUserID()

        return {
            ...joinPollsData,
            userID,
        }
    }

    async rejoinPoll(rejoinPollsData  : RejoinPollDataType){
        return rejoinPollsData
    }

}