import { EmployeeID, ShiftID } from "./shiftInfo";

export interface WeekShiftSummary {
    employeeId: EmployeeID,
    startOfWeek: string,
    regularHours: number,
    overtimeHours: number,
    invalidShifts: ShiftID[]
}