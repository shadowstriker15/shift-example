"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const firstValidShiftEntry = {
    ShiftID: 2663141019,
    EmployeeID: 41488322,
    StartTime: "2021-08-30T12:30:00.000000Z",
    EndTime: "2021-08-30T21:00:00.000000Z"
};
const firstValidWeekShiftEntryPair = {
    weekStr: '2021-08-29', shiftEntry: firstValidShiftEntry
};
const secondValidShiftEntry = {
    ShiftID: 2663141020,
    EmployeeID: 41488323,
    StartTime: "2021-08-31T12:30:00.000000Z",
    EndTime: "2021-08-31T21:00:00.000000Z"
};
const overlappingShiftEntry = {
    ShiftID: "2663024181",
    EmployeeID: 37958607,
    StartTime: "2021-08-30T13:00:00.000000Z",
    EndTime: "2021-08-30T15:30:00.000000Z"
};
describe('Test createWeekShiftEntryPairs()', () => {
    test('Normal test', () => {
        expect((0, index_1.createWeekShiftEntryPairs)(firstValidShiftEntry)).toStrictEqual([{ weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry }]);
    });
    test('Two week test', () => {
        const shiftId = 2662755313;
        const employeeId = 37791870;
        const startTime = '2021-08-28T11:30:00.000000Z';
        const endTime = '2021-08-29T23:00:00.000000Z';
        const midnight = '2021-08-29T05:00:00.000Z';
        const shift = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: endTime
        };
        const firstShift = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: midnight
        };
        const secondShift = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: midnight,
            EndTime: endTime
        };
        expect((0, index_1.createWeekShiftEntryPairs)(shift)).toStrictEqual([{ weekStr: '2021-08-22', shiftEntry: firstShift },
            { weekStr: '2021-08-29', shiftEntry: secondShift }]);
    });
    test('CDT to CST test', () => {
        const shiftId = 123;
        const employeeId = 37791870;
        const startTime = '2022-11-05T20:00:00.000Z';
        const endTime = '2022-11-06T20:00:00.000Z';
        const cdtMidnight = '2022-11-06T05:00:00.000Z';
        const cstMidnight = '2022-11-06T06:00:00.000Z';
        const shiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: endTime
        };
        const firstShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: cdtMidnight
        };
        const secondShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: cstMidnight,
            EndTime: endTime
        };
        expect((0, index_1.createWeekShiftEntryPairs)(shiftEntry)).toStrictEqual([{ weekStr: '2022-10-30', shiftEntry: firstShiftEntry }, { weekStr: '2022-11-06', shiftEntry: secondShiftEntry }]);
    });
});
describe('Test isFieldValid()', () => {
    test('Invalid field', () => {
        const field = null;
        expect((0, index_1.isFieldInvalid)(field)).toBe(true);
    });
    test('Valid string field', () => {
        const field = '123';
        expect((0, index_1.isFieldInvalid)(field)).toBe(false);
    });
    test('Invalid string field', () => {
        const field = '';
        expect((0, index_1.isFieldInvalid)(field)).toBe(true);
    });
    test('Valid number field', () => {
        const field = 123;
        expect((0, index_1.isFieldInvalid)(field)).toBe(false);
    });
});
describe('Test isShiftEntryValid()', () => {
    test('Valid shift entry - ShiftID as string', () => {
        const importedShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        };
        expect((0, index_1.isShiftEntryValid)(importedShiftEntry)).toBe(true);
    });
    test('Valid shift entry - ShiftID as number', () => {
        const importedShiftEntry = {
            ShiftID: 123,
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        };
        expect((0, index_1.isShiftEntryValid)(importedShiftEntry)).toBe(true);
    });
    test('Valid shift entry - EmployeeID as string', () => {
        const importedShiftEntry = {
            ShiftID: '123',
            EmployeeID: '123',
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        };
        expect((0, index_1.isShiftEntryValid)(importedShiftEntry)).toBe(true);
    });
    test('Valid shift entry - EmployeeID as number', () => {
        const importedShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        };
        expect((0, index_1.isShiftEntryValid)(importedShiftEntry)).toBe(true);
    });
    test('Invalid shift entry - field with a null value', () => {
        const importedShiftEntry = {
            ShiftID: null,
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-30T21:00:00.000000Z'
        };
        expect((0, index_1.isShiftEntryValid)(importedShiftEntry)).toBe(false);
    });
    test('Invalid shift entry - missing a field', () => {
        const importedShiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z'
        };
        expect((0, index_1.isShiftEntryValid)(importedShiftEntry)).toBe(false);
    });
});
describe('Test calculateShiftDuration()', () => {
    test('Normal test', () => {
        expect((0, index_1.calculateShiftDuration)(firstValidShiftEntry)).toBe(8.5);
    });
    test('Invalid start and end times test', () => {
        const shiftEntry = {
            ShiftID: '123',
            EmployeeID: 123,
            StartTime: '2021-08-30T12:30:00.000000Z',
            EndTime: '2021-08-29T12:30:00.000000Z'
        };
        expect((0, index_1.calculateShiftDuration)(shiftEntry)).toBe(0);
    });
});
describe('Test findInvalidShiftId()', () => {
    test('Valid test', () => {
        var weekShiftEntries = [
            {
                ShiftID: "2663024181",
                EmployeeID: 37958607,
                StartTime: "2021-08-31T13:00:00.000000Z",
                EndTime: "2021-08-31T15:30:00.000000Z"
            }
        ];
        expect((0, index_1.findInvalidShiftId)(firstValidShiftEntry, weekShiftEntries)).toBe(null);
    });
    test('Invalid test - shifts overlap', () => {
        const weekShiftEntries = [overlappingShiftEntry];
        expect((0, index_1.findInvalidShiftId)(firstValidShiftEntry, weekShiftEntries)).toBe(weekShiftEntries[0].ShiftID);
    });
});
describe('Test updateWeekShiftsInfo()', () => {
    test('Empty WeekToShiftInfo test', () => {
        var weekToShifts = {};
        const weekShiftEntryPair = { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry };
        (0, index_1.updateWeekShiftsInfo)(weekToShifts, weekShiftEntryPair);
        expect(weekToShifts).toStrictEqual({ '2021-08-29': { shifts: [firstValidShiftEntry], invalidShifts: [] } });
    });
    test('Invalid shift entries found test', () => {
        var weekToShifts = { '2021-08-29': { shifts: [overlappingShiftEntry], invalidShifts: [] } };
        const weekShiftEntryPair = { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry };
        (0, index_1.updateWeekShiftsInfo)(weekToShifts, weekShiftEntryPair);
        expect(weekToShifts).toStrictEqual({ '2021-08-29': { shifts: [], invalidShifts: [overlappingShiftEntry.ShiftID, firstValidShiftEntry.ShiftID] } });
    });
    test('Found week string in WeekToShiftInfo test', () => {
        const shiftEntry = {
            ShiftID: 2663141020,
            EmployeeID: 41488321,
            StartTime: "2021-08-31T12:30:00.000000Z",
            EndTime: "2021-08-31T21:00:00.000000Z"
        };
        var weekToShifts = { '2021-08-29': { shifts: [shiftEntry], invalidShifts: [] } };
        const weekShiftEntryPair = { weekStr: firstValidWeekShiftEntryPair.weekStr, shiftEntry: firstValidShiftEntry };
        (0, index_1.updateWeekShiftsInfo)(weekToShifts, weekShiftEntryPair);
        expect(weekToShifts).toStrictEqual({ '2021-08-29': { shifts: [shiftEntry, firstValidShiftEntry], invalidShifts: [] } });
    });
});
describe('Test computeShifts()', () => {
    test('Valid test - multiple shift entries for an employee', () => {
        const shiftEntry = {
            ShiftID: 2663141020,
            EmployeeID: firstValidShiftEntry.EmployeeID,
            StartTime: "2021-08-31T12:30:00.000000Z",
            EndTime: "2021-08-31T21:00:00.000000Z"
        };
        const dataset = [
            firstValidShiftEntry,
            shiftEntry
        ];
        expect((0, index_1.computeShifts)(dataset)).toStrictEqual([
            {
                id: firstValidShiftEntry.EmployeeID,
                weekToShiftsInfo: { '2021-08-29': { shifts: [firstValidShiftEntry, shiftEntry], invalidShifts: [] } }
            }
        ]);
    });
    test('Valid test - multiple shift entries for multiple employees', () => {
        const dataset = [
            firstValidShiftEntry,
            secondValidShiftEntry
        ];
        expect((0, index_1.computeShifts)(dataset)).toStrictEqual([
            {
                id: firstValidShiftEntry.EmployeeID,
                weekToShiftsInfo: { '2021-08-29': { shifts: [firstValidShiftEntry], invalidShifts: [] } }
            },
            {
                id: secondValidShiftEntry.EmployeeID,
                weekToShiftsInfo: { '2021-08-29': { shifts: [secondValidShiftEntry], invalidShifts: [] } }
            }
        ]);
    });
    test('Invalid test', () => {
        const dataset = [
            {
                ShiftID: null,
                EmployeeID: 123,
                StartTime: '2021-08-30T12:30:00.000000Z',
                EndTime: '2021-08-30T21:00:00.000000Z'
            }
        ];
        expect((0, index_1.computeShifts)(dataset)).toStrictEqual([]);
    });
});
describe('Test calculateWeekShiftSummary()', () => {
    test('Valid test with two employees', () => {
        const employees = [
            {
                id: firstValidShiftEntry.EmployeeID,
                weekToShiftsInfo: { '2021-08-29': { shifts: [firstValidShiftEntry], invalidShifts: [] } }
            },
            {
                id: secondValidShiftEntry.EmployeeID,
                weekToShiftsInfo: { '2021-08-29': { shifts: [secondValidShiftEntry], invalidShifts: [] } }
            }
        ];
        expect((0, index_1.calculateWeekShiftSummary)(employees)).toStrictEqual([
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
        ]);
    });
    test('CDT to CST test', () => {
        const shiftId = 123;
        const employeeId = 123;
        const startTime = '2022-11-05T20:00:00.00Z';
        const endTime = '2022-11-06T20:00:00.00Z';
        const cdtMidnight = '2022-11-06T05:00:00.000Z';
        const cstMidnight = '2022-11-06T06:00:00.000Z';
        const firstShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: startTime,
            EndTime: cdtMidnight
        };
        const secondShiftEntry = {
            ShiftID: shiftId,
            EmployeeID: employeeId,
            StartTime: cstMidnight,
            EndTime: endTime
        };
        const employees = [
            {
                id: employeeId,
                weekToShiftsInfo: {
                    '2022-10-30': { shifts: [firstShiftEntry], invalidShifts: [] },
                    '2022-11-06': { shifts: [secondShiftEntry], invalidShifts: [] }
                }
            },
        ];
        expect((0, index_1.calculateWeekShiftSummary)(employees)).toStrictEqual([
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
        ]);
    });
});
describe('Test outputWeekShiftSummaries()', () => {
    jest.setTimeout(10000);
    test('Normal test', () => __awaiter(void 0, void 0, void 0, function* () {
        const success = yield (0, index_1.outputWeekShiftSummaries)();
        expect(success).toBe(true);
    }));
});
//# sourceMappingURL=index.test.js.map