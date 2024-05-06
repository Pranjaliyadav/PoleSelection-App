import { IsIn, IsInt, IsString, Length, Max, Min } from "class-validator";

export class CreatePollsDto {

    @IsString()
    @Length(1, 100)
    topic: string;

    @IsInt()
    @Min(1)
    @Max(5)
    votesPerVoter : number;

    @IsString()
    @Length(1,25)
    userName : string;
}

export class JoinPollsDto { 
    @IsString()
    @Length(6,6)
    pollID : string;

    @IsString()
    @Length(1,25)
    userName : string;
}