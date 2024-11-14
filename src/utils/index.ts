import { Types } from "mongoose";

const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

export const covertObjectId = (id: string) : Types.ObjectId => {
    return new Types.ObjectId(id);
}