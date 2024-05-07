import { customAlphabet, nanoid } from "nanoid";

export const createUniquePollID = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', //OPTIONS TO CHOOSE FROM
    6, //LENGTH
)

export const createUniqueUserID = () => nanoid()
export const createUniqueNominationID = () => nanoid(8)