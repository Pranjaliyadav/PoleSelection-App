//types to be used in service
export type CreatePollsDataType = {
    topic : string;
    votesPerVoter : number;
    userName : string;
}

export type JoinPollsDataType = {
    pollID : string;
    userName : string;
}

export type RejoinPollDataType = {
    pollID : string;
    userID : string;
    userName : string;
}

//types to be used in repos

export type CreatePollData = {
    pollID : string;
    topic : string;
    votesPerVoter : number;
    userID : string;

}

export type AddParticipantData = {
    pollID : string;
    userID : string;
    userName : string;
}

