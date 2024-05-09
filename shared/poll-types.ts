export interface Participants {
    [prticipantID : string] : string;
}

export interface Poll { 
    id : string;
    topic : string;
    votesPerVoter : number;
    participants : Participants;
    adminID : string;
    // nominations : Nominations;
    // rankings : Rankings;
    // results : SpeechRecognitionResultList;
    // hasStarted : boolean;
}