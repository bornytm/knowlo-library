import { DateTime } from "neo4j-driver/types/v1";
import moment from "moment";

export const neo4jDateTimeToISOString = (date: DateTime): string => {
    const mDate = moment({
        year: date.year.low,
        month: date.month.low - 1,
        day: date.day.low,
        minute: date.minute.low,
        second: date.second.low,
        millisecond: Math.round(date.nanosecond.low / 1000 / 1000),
    });
    return mDate.toISOString();
};