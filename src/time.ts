import { TIMEZONE } from "./index";

/**
* Converts the timezone of the passed into date string
* @param timezone The specified timezone to convert to 
* @returns The date that has been converted to the specificed timezone
*/
export function convertTimezone( dateObjUTC: Date, timezone: string ): Date {
    return new Date( dateObjUTC.toLocaleString( 'en-US', {timeZone: timezone} ) );
}

/**
* Gets the starting date of a week from passed in date
* @param startDateStrUTC The date to find its starting week date
* @returns The starting date of the week for the passed in date
*/
export function getWeekStartDate( startDateStrUTC: string ): string {
    const startDateObjCdt = convertTimezone( new Date( startDateStrUTC ), TIMEZONE );
    const startDayOfWeek = startDateObjCdt.getDay();

    if( startDayOfWeek == 0 )
    {
        // Return current date
        return `${ startDateObjCdt.getFullYear() }-${ startDateObjCdt.getMonthNum() }-${ startDateObjCdt.getDateNum() }`;
    }

    // Get last sunday's date
    const weekStartDate = new Date( startDateObjCdt.getTime() );
    weekStartDate.setDate( startDateObjCdt.getDate() - startDayOfWeek ); //( startDayOfWeek == 0 ? 7 : startDayOfWeek ) );

    return `${ weekStartDate.getFullYear() }-${ weekStartDate.getMonthNum() }-${ weekStartDate.getDateNum() }`;
}
