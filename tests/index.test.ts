
import { Employee } from '../src/types/employee';
import { ImportedShiftEntry } from '../src/types/importedShiftEntry';
import { ShiftEntry } from '../src/types/shiftEntry';
import { WeekToShiftsInfo } from '../src/types/shiftInfo';
import { WeekShiftEntryPair } from '../src/types/weekShiftEntryPair';

import { calculateShiftDuration, findInvalidShiftId, createWeekShiftEntryPairs, isFieldInvalid, isShiftEntryValid, updateWeekShiftsInfo, computeShifts, calculateWeekShiftSummary, outputWeekShiftSummaries } from '../src/index'


const firstValidShiftEntry: ShiftEntry = {
    ShiftID: 2663141019,
    EmployeeID: 41488322,
    StartTime: "2021-08-30T12:30:00.000000Z",
    EndTime: "2021-08-30T21:00:00.000000Z"
}

const firstValidWeekShiftEntryPair: WeekShiftEntryPair = {
    weekStr: '2021-08-29', shiftEntry: firstValidShiftEntry
}

const secondValidShiftEntry =
{
    ShiftID: 2663141020,
    EmployeeID: 41488323,
    StartTime: "2021-08-31T12:30:00.000000Z",
    EndTime: "2021-08-31T21:00:00.000000Z"
}

const overlappingShiftEntry: ShiftEntry = {
    ShiftID: "2663024181",
    EmployeeID: 37958607,
    StartTime: "2021-08-30T13:00:00.000000Z",
    EndTime: "2021-08-30T15:30:00.000000Z"
}

describe( 'Test createWeekShiftEntryPairs()', () => {
    test( 'Normal test', () => {
        expect( createWeekShiftEntryPairs( firstValidShiftEntry ) ).toStrictEqual
            (
            [ { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry } ]
            );
    } );
    test( 'Two week test', () => {
        const shiftId = 2662755313;
        const employeeId = 37791870;
        const startTime = '2021-08-28T11:30:00.000000Z';
        const endTime = '2021-08-29T23:00:00.000000Z' ;

        const midnight = '2021-08-29T05:00:00.000Z';

        const shift: ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: endTime
        };
        const firstShift : ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: midnight
        };
        const secondShift : ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: midnight,
            EndTime: endTime
        };

        expect( createWeekShiftEntryPairs( shift ) ).toStrictEqual
            (
            [ { weekStr: '2021-08-22', shiftEntry: firstShift },
              { weekStr: '2021-08-29', shiftEntry: secondShift } ]
            );
    } );
    test( 'CDT to CST test', () => {
        const shiftId = 123;
        const employeeId = 37791870;
        const startTime = '2022-11-05T20:00:00.000Z';
        const endTime = '2022-11-06T20:00:00.000Z';
        const cdtMidnight = '2022-11-06T05:00:00.000Z';
        const cstMidnight = '2022-11-06T06:00:00.000Z';

        const shiftEntry: ShiftEntry =  {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: endTime
        }

        const firstShiftEntry: ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: cdtMidnight
        }

        const secondShiftEntry: ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: cstMidnight,
            EndTime: endTime
        }
        expect( createWeekShiftEntryPairs( shiftEntry ) ).toStrictEqual
            (
            [ { weekStr: '2022-10-30', shiftEntry: firstShiftEntry }, { weekStr: '2022-11-06', shiftEntry: secondShiftEntry } ]
            );
    } );
} );

describe( 'Test isFieldValid()', () => {
    test( 'Invalid field', () => {
        const field = null;
        expect( isFieldInvalid( field ) ).toBe( true );
    } );
    test( 'Valid string field', () => {
        const field = '123';
        expect( isFieldInvalid( field ) ).toBe( false );
    } );
    test( 'Invalid string field', () => {
        const field = '';
        expect( isFieldInvalid( field ) ).toBe( true );
    } );
    test( 'Valid number field', () => {
        const field = 123;
        expect( isFieldInvalid( field ) ).toBe( false );
    } );
});

describe( 'Test isShiftEntryValid()', () => {
    test( 'Valid shift entry - ShiftID as string', () => {
        const importedShiftEntry: ImportedShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        }
        expect( isShiftEntryValid( importedShiftEntry ) ).toBe( true );
    } );
    test( 'Valid shift entry - ShiftID as number', () => {
        const importedShiftEntry: ImportedShiftEntry = {
            ShiftID: 123,
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        }
        expect( isShiftEntryValid( importedShiftEntry ) ).toBe( true );
    } );
    test( 'Valid shift entry - EmployeeID as string', () => {
        const importedShiftEntry: ImportedShiftEntry = {
            ShiftID: '123',
            EmployeeID: '123',
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        }
        expect( isShiftEntryValid( importedShiftEntry ) ).toBe( true );
    } );
    test( 'Valid shift entry - EmployeeID as number', () => {
        const importedShiftEntry: ImportedShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        }
        expect( isShiftEntryValid( importedShiftEntry ) ).toBe( true );
    } );
    test( 'Invalid shift entry - field with a null value', () => {
        const importedShiftEntry: ImportedShiftEntry = {
            ShiftID: null,
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        }
        expect( isShiftEntryValid( importedShiftEntry ) ).toBe( false );
    } );
    test( 'Invalid shift entry - missing a field', () => {
        const importedShiftEntry: ImportedShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z'
        }
        expect( isShiftEntryValid( importedShiftEntry ) ).toBe( false );
    } );
} )

describe( 'Test calculateShiftDuration()', () => {
    test( 'Normal test', () => {
        expect( calculateShiftDuration( firstValidShiftEntry ) ).toBe( 8.5 );
    } );
    test( 'Invalid start and end times test', () => {
        const shiftEntry: ShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-29T12:30:00.000000Z'
        }
        expect( calculateShiftDuration( shiftEntry ) ).toBe( 0 );
    } );
});

describe( 'Test findInvalidShiftId()', () => {
    test( 'Valid test', () => {
        var weekShiftEntries: ShiftEntry[] =
            [
                {
                ShiftID: "2663024181",
                EmployeeID: 37958607,
                StartTime: "2021-08-31T13:00:00.000000Z",
                EndTime: "2021-08-31T15:30:00.000000Z"
                }
            ];
        expect( findInvalidShiftId( firstValidShiftEntry, weekShiftEntries ) ).toBe( null );
    } );
    test( 'Invalid test - shifts overlap', () => {
        const weekShiftEntries: ShiftEntry[] = [ overlappingShiftEntry ];
        expect( findInvalidShiftId( firstValidShiftEntry, weekShiftEntries ) ).toBe( weekShiftEntries[0].ShiftID );
    } );
});

describe( 'Test updateWeekShiftsInfo()', () => {
    test( 'Empty WeekToShiftInfo test', () => {
        var weekToShifts: WeekToShiftsInfo = {}
        const weekShiftEntryPair: WeekShiftEntryPair = { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry };

        updateWeekShiftsInfo( weekToShifts, weekShiftEntryPair );
        expect( weekToShifts ).toStrictEqual( { '2021-08-29': { shifts: [ firstValidShiftEntry ], invalidShifts: [] } } );
    } );
    test( 'Invalid shift entries found test', () => {
        var weekToShifts: WeekToShiftsInfo = { '2021-08-29': { shifts: [ overlappingShiftEntry ], invalidShifts: [] } }
        const weekShiftEntryPair: WeekShiftEntryPair = { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry };

        updateWeekShiftsInfo( weekToShifts, weekShiftEntryPair );
        expect( weekToShifts ).toStrictEqual
            (
            { '2021-08-29': { shifts: [], invalidShifts: [ overlappingShiftEntry.ShiftID, firstValidShiftEntry.ShiftID ] } }
            );
    } );
    test( 'Found week string in WeekToShiftInfo test', () => {
        const shiftEntry: ShiftEntry = {
            ShiftID: 2663141020,
            EmployeeID: 41488321,
            StartTime: "2021-08-31T12:30:00.000000Z",
            EndTime: "2021-08-31T21:00:00.000000Z"
        }

        var weekToShifts: WeekToShiftsInfo = { '2021-08-29': { shifts: [ shiftEntry ], invalidShifts: [] } }
        const weekShiftEntryPair: WeekShiftEntryPair = { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry };

        updateWeekShiftsInfo( weekToShifts, weekShiftEntryPair );
        expect( weekToShifts ).toStrictEqual
            (
            { '2021-08-29': { shifts: [ shiftEntry, firstValidShiftEntry ], invalidShifts: [] } }
            );
    } );
});

describe( 'Test computeShifts()', () => {
    test( 'Valid test - multiple shift entries for an employee', () => {
        const shiftEntry =
        {
            ShiftID: 2663141020,
            EmployeeID: firstValidShiftEntry.EmployeeID,
            StartTime: "2021-08-31T12:30:00.000000Z",
            EndTime: "2021-08-31T21:00:00.000000Z"
        }

        const dataset: any[] = [
            firstValidShiftEntry,
            shiftEntry
        ]
        expect( computeShifts( dataset ) ).toStrictEqual
            (
            [
                {
                id: firstValidShiftEntry.EmployeeID,
                weekToShiftsInfo: {'2021-08-29': { shifts: [ firstValidShiftEntry, shiftEntry ], invalidShifts: [] } }
                }
            ]
            );
    } );
    test( 'Valid test - multiple shift entries for multiple employees', () => {
        const dataset: any[] = [
            firstValidShiftEntry,
            secondValidShiftEntry
        ]
        expect( computeShifts( dataset ) ).toStrictEqual
            (
            [
                {
                id: firstValidShiftEntry.EmployeeID,
                weekToShiftsInfo: {'2021-08-29': { shifts: [ firstValidShiftEntry ], invalidShifts: [] } }
                },
                {
                id: secondValidShiftEntry.EmployeeID,
                weekToShiftsInfo: {'2021-08-29': { shifts: [ secondValidShiftEntry ], invalidShifts: [] } }
                }
            ]
            );
    } );
    test( 'Invalid test', () => {
        const dataset: any[] = [
            {
                ShiftID: null,
                EmployeeID: 123,
                StartTime: '2021-08-30T12:30:00.000000Z',
                EndTime: '2021-08-30T21:00:00.000000Z'
            }
        ]
        expect( computeShifts( dataset ) ).toStrictEqual( [] );
    } );
});

describe( 'Test calculateWeekShiftSummary()', () => {
    test( 'Valid test with two employees', () => {
        const employees: Employee[] = 
        [
            {
            id: firstValidShiftEntry.EmployeeID,
            weekToShiftsInfo: {'2021-08-29': { shifts: [ firstValidShiftEntry ], invalidShifts: [] } }
            },
            {
            id: secondValidShiftEntry.EmployeeID,
            weekToShiftsInfo: {'2021-08-29': { shifts: [ secondValidShiftEntry ], invalidShifts: [] } }
            }
        ]
        expect( calculateWeekShiftSummary( employees ) ).toStrictEqual
            (
            [
                {
                employeeId: firstValidShiftEntry.EmployeeID,
                startOfWeek: '2021-08-29',
                regularHours: 8.5,
                overtimeHours: 0,
                invalidShifts: []
                },
                {
                employeeId: secondValidShiftEntry.EmployeeID,
                startOfWeek: '2021-08-29',
                regularHours: 8.5,
                overtimeHours: 0,
                invalidShifts: []
                }
            ]
            );
    } );
    test( 'CDT to CST test', () => {
        const shiftId = 123;
        const employeeId = 123;
        const startTime = '2022-11-05T20:00:00.00Z';
        const endTime = '2022-11-06T20:00:00.00Z';
        const cdtMidnight = '2022-11-06T05:00:00.000Z';
        const cstMidnight = '2022-11-06T06:00:00.000Z';

        const firstShiftEntry: ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: cdtMidnight
        }

        const secondShiftEntry: ShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: cstMidnight,
            EndTime: endTime
        }

        const employees: Employee[] = 
        [
            {
            id: employeeId,
            weekToShiftsInfo: 
                {
                '2022-10-30': { shifts: [ firstShiftEntry ], invalidShifts: [] },
                '2022-11-06': { shifts: [ secondShiftEntry ], invalidShifts: [] }
                }
            },
        ]
        expect( calculateWeekShiftSummary( employees ) ).toStrictEqual
            (
            [
                {
                employeeId: employeeId,
                startOfWeek: '2022-10-30',
                regularHours: 9,
                overtimeHours: 0,
                invalidShifts: []
                },
                {
                employeeId: employeeId,
                startOfWeek: '2022-11-06',
                regularHours: 14,
                overtimeHours: 0,
                invalidShifts: []
                }
            ]
            );
    } );
});

describe( 'Test outputWeekShiftSummaries()', () => {
    jest.setTimeout( 10000 );
    test( 'Normal test', async () => {
        const success = await outputWeekShiftSummaries();
        expect(success).toBe(true);
    } );
});
