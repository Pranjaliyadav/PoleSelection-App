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