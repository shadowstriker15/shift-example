import { EmployeeID, ShiftID } from "./shiftInfo";

export type ShiftEntry = {
    ShiftID: EmployeeID;
    EmployeeID: number;
    StartTime: string;
    EndTime: string;
}
