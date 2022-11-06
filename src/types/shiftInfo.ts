import { ShiftEntry } from './shiftEntry';

export type ShiftID = number | string;
export type EmployeeID = number | string;

export type ShiftInfo = {
    shifts: ShiftEntry[], invalidShifts: ShiftID[]
}

export interface WeekToShiftsInfo {
    [key: string]: ShiftInfo;
}