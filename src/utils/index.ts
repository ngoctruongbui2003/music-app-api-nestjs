import { Types } from "mongoose";

const _ = require('lodash');

export * from './jwt';

export const convertObjectId = (id: string) : Types.ObjectId => {
    return new Types.ObjectId(id);
}

export const getInfoData = (object: Record<string, any>, fields: string[]) => {
    return _.pick(object, fields)
}

export const getSelectData = (select = []) => {
    return Object.fromEntries( select.map( key => [key, 1] ) )
}

export const unGetSelectData = (select = []) => {
    return Object.fromEntries( select.map( key => [key, 0] ) )
}

export const parseSelectFields = (select: string) => {
    return select.split(',').join(' ');
}

export const parseSortFields = (sort: string) => {
    const fields = sort.split(',');

    const sortCriteria: { [key: string]: 1 | -1 } = {};

    fields.forEach(field => {
        if (field.startsWith('-')) {
            sortCriteria[field.slice(1)] = -1; 
        } else {
            sortCriteria[field] = 1;
        }
    });

    return sortCriteria;
}
