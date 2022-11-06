# Shift Example

This TypeScript project computes weekly hours for employees from work shift entries. This project also contains JEST test cases.

This program:
* Calculates an employee's weekly hours from shift entries
* Detects invalid shifts (when two shifts overlap with each other)

This program accounts for:
* Shifts that cross over two weeks
* Shifts that happen during the CST to CDT transition

## Getting Started

To be able to compile this program and run through the test cases, please follow these simple steps.

## Prerequisites

To compile this program, you will need the necessary Node dependencies installed. Before attempting to install these, please make sure you have the latest [Node.js](https://nodejs.org/en/) (v14.17.3 or later) installed on your local machine.

Once you have ensured that you have Node.js installed, please navigate to the project's home directory (shift-example). Please run the following command to install the necessary dependencies.

  ```sh
  npm i
  ```

## Compiling

Because we have watch set to true in the project's tsconfig.json file, any file changes will be detected and the program will compile automatically whenever you run the following command.

  ```sh
  tsc
  ```


## Testing

To run the JEST test cases (which will also create the output file) please run the following command.

  ```sh
  npx jest
  ```

## Input

The input to this program (dataset.json) is described with the following table


| Field      | Description                                                                                                      | Example                 |
|------------|------------------------------------------------------------------------------------------------------------------|-------------------------|
| ShiftID    | Shift ID is a unique numeric identifier for the shift. This is a 64-bit value.                                   | 123                     |
| EmployeeID | Employee ID is the numeric identifier of the employee who worked the shift. This is a 64-bit value.              | 456                     |
| StartTime  | An RFC3339 formatted date time string indicating the start of the shift.                                         | 1985-04-12T23:20:50.52Z |
| EndTime    | An RFC3339 formatted date time string indicating the end of the shift. This must be greater than the start time. | 1985-04-13T07:19:14.03Z |

## Output

The outputted JSON file is described with the following table

| Field         | Description                                                                                     |
|---------------|-------------------------------------------------------------------------------------------------|
| EmployeeID    | The ID of the employee for this particular summary object.                                      |
| StartOfWeek   | The date that this week began on in the following format: "YYYY-MM-DD"                          |
| RegularHours  | The total number of regular hours for this employee during this week excluding invalid shifts.  |
| OvertimeHours | The total number of overtime hours for this employee during this week excluding invalid shifts. |
| InvalidShifts | An array of Shift IDs that overlap for this employee during this week.                          |

## What's Next

Some ideas I had that I could work on would be:
*  Test shifts that last longer than two weeks (probably classify this as an error)
*  Add validation for the format of a time string
*  Test shifts that happen during the transition from CST to CDT (note here that I do already have tests for the CDT to CST transition)
* Add a test for convertTimezone()
* Clean up some tests by making variables for values that get reused (partially achieving this)
* Add some more test cases for edge cases
