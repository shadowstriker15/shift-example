import fs from 'fs';

import { Employee } from './types/employee';
import { ImportedShiftEntry } from './types/importedShiftEntry';
import { WeekShiftEntryPair } from './types/weekShiftEntryPair';
import { WeekShiftSummary } from './types/weekShiftSummary';
import { WeekToShiftsInfo, ShiftInfo, ShiftID } from './types/shiftInfo';
import { ShiftEntry } from './types/shiftEntry';
import './types/date.extensions';

import { convertTimezone, getWeekStartDate } from './time';

import dataset from './dataset.json';

export const TIMEZONE = 'America/Chicago';

/**
* Check whether or not a field is invalid
* @param field A field
* @returns Whether or not the passed field is invalid
*/
export function isFieldInvalid( field: any ): boolean {
    return !field || field == '';
}

/**
* Check whether or not a shift entry is valid
* @param importedShiftEntry An imported shift entry
* @returns Whether or not the passed imported shift entry is valid
*/
export function isShiftEntryValid( importedShiftEntry: ImportedShiftEntry ): boolean {
    if( isFieldInvalid( importedShiftEntry.ShiftID ) )
    {  
        console.warn( 'Invalid shift entry with an invalid ShiftID was found.' );
        return false;
    }
    if( isFieldInvalid( importedShiftEntry.EmployeeID ) )
    {  
        console.warn( `Shift with ID ${ importedShiftEntry.ShiftID } has an invalid EmployeeID.` );
        return false;
    }
    if( isFieldInvalid( importedShiftEntry.StartTime ) )
    {
        console.warn( `Shift with ID ${ importedShiftEntry.ShiftID } has an invalid StartTime.` );
        return false;
    }
    if( isFieldInvalid( importedShiftEntry.EndTime ) )
    {
        console.warn( `Shift with ID ${ importedShiftEntry.ShiftID } has an invalid EndTime.` );
        return false
    }
    const startTime =  new Date( importedShiftEntry.StartTime ).getTime();
    const endTime = new Date( importedShiftEntry.EndTime ).getTime();

    if( endTime < startTime )
    {
        console.warn
            (
            `Shift with ID ${ importedShiftEntry.ShiftID } is invalid. Its EndTime is before its StartTime.`
            );
        return false;
    }
    return true;
}

/**
* Creates an array of WeekShiftEntryPairs
* @param shiftEntry The validated shift entry to used to create WeekShiftEntryPairs
* @returns An array of computed WeekShiftEntryPairs
*/
export function createWeekShiftEntryPairs( shiftEntry: ShiftEntry ): WeekShiftEntryPair[] {
    const startDateObjCentral = convertTimezone( new Date( shiftEntry.StartTime ), TIMEZONE );
    const endDateObjCentral = convertTimezone( new Date( shiftEntry.EndTime ), TIMEZONE );
    var weekShiftEntryPairArray = [];

    // Check if start and end dates are in different weeks
    if( getWeekStartDate( shiftEntry.StartTime ) != getWeekStartDate( shiftEntry.EndTime ) )
    {
        // Find the sunday midnight between the two weeks
        var midnight = new Date( startDateObjCentral.getTime() );
        midnight.setDate( startDateObjCentral.getDate() + ( 7 - startDateObjCentral.getDay() - 1 ) );
        midnight.setHours( 24, 0, 0, 0 );
        var midnigthStr = midnight.toISOString();

        // First entry
        var firstShiftEntry = Object.assign( {}, shiftEntry );
        firstShiftEntry.EndTime = midnigthStr;
        weekShiftEntryPairArray.push( {weekStr: getWeekStartDate( shiftEntry.StartTime ), shiftEntry: firstShiftEntry } );

        const timezoneOffsetDiff = ( endDateObjCentral.getTimezoneOffset() - startDateObjCentral.getTimezoneOffset() ) / 60;
        if( timezoneOffsetDiff != 0 )
        {
            midnight.setHours( midnight.getHours() + timezoneOffsetDiff );
            midnigthStr = midnight.toISOString();
        }

        // Second entry
        var secondShiftEntry = Object.assign( {}, shiftEntry );
        secondShiftEntry.StartTime = midnigthStr;
        weekShiftEntryPairArray.push( {weekStr: getWeekStartDate( midnigthStr ), shiftEntry: secondShiftEntry } );
    }
    else
    {
        weekShiftEntryPairArray.push( {weekStr: getWeekStartDate( shiftEntry.StartTime ), shiftEntry: shiftEntry } );
    }

    return weekShiftEntryPairArray;
}

/**
* Looks for an invalid shiftID that has been added to the passed ShiftEntry array
* @param shiftEntry The new shift entry we are comparing to find an invalid shiftID
* @param weekShiftEntries An array of ShiftEntries that we will use to compare with the new shift entry
* @returns An array of computed WeekShiftEntryPairs
*/
export function findInvalidShiftId( shiftEntry : ShiftEntry, weekShiftEntries: ShiftEntry[] ) : ShiftID | null {
    var newStartDate = new Date( shiftEntry.StartTime );
    var newEndDate = new Date( shiftEntry.EndTime );

    for( const shiftEntry of weekShiftEntries )
    {
        let startDate = new Date( shiftEntry.StartTime );
        let endDate = new Date( shiftEntry.EndTime );

        if( newStartDate <= endDate && newEndDate >= startDate )
        {
            return shiftEntry.ShiftID;
        }
    }

    return null;
}

/**
* Calculates a shiftEntry's duration
* @param shiftEntry The shiftEntry to find its duration
* @returns The shiftEntry's computed duration
*/
export function calculateShiftDuration( shiftEntry : ShiftEntry ): number {
    const startTime =  new Date( shiftEntry.StartTime ).getTime();
    const endTime = new Date( shiftEntry.EndTime ).getTime();

    if( endTime < startTime )
    {
        console.warn
            (
            `Shift with ID ${ shiftEntry.ShiftID } reached calculateShiftDuration() is invalid as its EndTime is before the StartTime.`
            );
        return 0;
    }
    const durationSec = ( endTime - startTime ) / 1000;
    return Math.round( ( durationSec / 3600 ) * 100 ) / 100;
}

/**
* Updates the passed WeekToShiftsInfo with the new WeekShiftEntryPair
* @param weekToShifts The WeekToShiftInfo we will update
* @param weekShiftEntryPair The WeekShiftEntryPair we will update the WeekToShiftInfo with
*/
export function updateWeekShiftsInfo( weekToShifts: WeekToShiftsInfo, weekShiftEntryPair: WeekShiftEntryPair ): void {
    var weekShiftsInfo : ShiftInfo;
    if( weekToShifts[ weekShiftEntryPair.weekStr ] )
    {
        weekShiftsInfo = weekToShifts[ weekShiftEntryPair.weekStr ];
    }
    else
    {
        weekShiftsInfo = {shifts: [], invalidShifts: []}
        weekToShifts[ weekShiftEntryPair.weekStr ] = weekShiftsInfo;
    }

    const foundInvalidShiftId = findInvalidShiftId( weekShiftEntryPair.shiftEntry, weekShiftsInfo.shifts );
    if( foundInvalidShiftId )
    {
        // Remove invalid shift from saved shifts
        weekShiftsInfo.shifts = weekShiftsInfo.shifts.filter(( shift ) => {
            return shift.ShiftID != foundInvalidShiftId;
        });
        weekShiftsInfo.invalidShifts.push( foundInvalidShiftId );
        weekShiftsInfo.invalidShifts.push( weekShiftEntryPair.shiftEntry.ShiftID );
    }
    else
    {
        weekShiftsInfo.shifts.push( weekShiftEntryPair.shiftEntry );
    }
}

/**
* Sorts the imported dataset by employeeID and by the shift's week start
* @param dataset The imported shift entries
* @returns An array of Employees that contain the WeekToShiftsInfo
*/
export function computeShifts( dataset: any[] ): Employee[] {
    var employees: Employee[] = [];

    dataset.forEach( ( importedShiftEntry: ImportedShiftEntry ) => {
        if( !isShiftEntryValid( importedShiftEntry ) )
        {
            return;
        }
        var shiftEntry: ShiftEntry = importedShiftEntry as ShiftEntry;

        let employeeList = employees.filter(( employee : Employee ) => {
            return employee.id == shiftEntry.EmployeeID;
        })

        const weekShiftEntryPairArray = createWeekShiftEntryPairs( shiftEntry );

        if( employeeList.length )
        {
            let employee = employeeList[0];
            let weekToShifts = employee.weekToShiftsInfo;

            weekShiftEntryPairArray.forEach( weekShiftEntryPair => {
                updateWeekShiftsInfo( weekToShifts, weekShiftEntryPair );
            });
        }
        else
        {
            // Add employee to array
            weekShiftEntryPairArray.forEach( weekShiftEntryPair => {
                var weekToShifts : WeekToShiftsInfo = {};
                weekToShifts[ weekShiftEntryPair.weekStr ] = {shifts: [ weekShiftEntryPair.shiftEntry ], invalidShifts: [] };
                employees.push( { id: weekShiftEntryPair.shiftEntry.EmployeeID, weekToShiftsInfo: weekToShifts } );
            });
        }
    });
    return employees;
}

/**
* Calculates the week shift summaries for an array of Employees
* @param employees The array of employees to calculate week shift summaries from
* @returns An array of WeekShiftSummaries
*/
export function calculateWeekShiftSummary( employees: Employee[] ): WeekShiftSummary[] {
    var weekShiftSummaries : WeekShiftSummary[] = [];

    employees.forEach( employee => {
        for( const weekKey in employee.weekToShiftsInfo )
        {
            const weekShiftsInfo = employee.weekToShiftsInfo[weekKey];
            var totalHours = 0;
            weekShiftsInfo.shifts.forEach( shiftEntry => {
                totalHours += calculateShiftDuration( shiftEntry );
            });
            
            var regularHours = 0;
            var overtimeHours = 0;
            if(totalHours > 40)
            {
                regularHours = 40;
                overtimeHours = totalHours - 40;
            }
            else
            {
                regularHours = totalHours;
            }

            let weekShiftSummary : WeekShiftSummary =
                {
                employeeId: employee.id,
                startOfWeek: weekKey,
                regularHours: regularHours,
                overtimeHours: overtimeHours,
                invalidShifts: weekShiftsInfo.invalidShifts
                };
            weekShiftSummaries.push( weekShiftSummary );
        }
    });

    return weekShiftSummaries;
}

/**
* Outputs the WeekShiftSummaries to a JSON file
* @param path The path to the file to output the data to
* @returns Promise of creation
*/
export function outputWeekShiftSummaries( path: string = 'output.json' ): Promise<boolean> {
    var employees = computeShifts( dataset );
    var weekShiftSummaries : WeekShiftSummary[] = calculateWeekShiftSummary( employees );

    return new Promise<boolean>( (resolve, reject) => {
        fs.writeFile( path, JSON.stringify( weekShiftSummaries ), ( err ) => {
            if ( err ) {
                console.error( `Failed to write output file: ${err}` );
                reject( false );
            }
            // console.log("The output file was written successfully");
            resolve( true );
        } )
    } )
}

//TODO
// If I had more time
// Test shifts that last longer than two weeks (possible?)
// Validate the format of a time string
// Test CST to CDT
