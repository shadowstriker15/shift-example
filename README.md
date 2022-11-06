# Code Challenge Overview

You may or may not finish this - either is ok. If we move forward to final interviews, we'll pair on your solution together, reviewing/troubleshooting/trying new things.

* Testing is required.
* Error handling is required.
* In your readme, please tell us what you would do next if you spent more time on this.
* If a large part of your solution is framework, tell us where we can easily spot the code you’ve personally added.

## Requirements

Given the included json file `dataset.json`. Write a program that reads the file and parses the shifts in the file.

Shifts are given the following fields:

| Field      | Description                                                                                                      | Example                 |
|------------|------------------------------------------------------------------------------------------------------------------|-------------------------|
| ShiftID    | Shift ID is a unique numeric identifier for the shift. This is a 64-bit value.                                   | 123                     |
| EmployeeID | Employee ID is the numeric identifier of the employee who worked the shift. This is a 64-bit value.              | 456                     |
| StartTime  | An RFC3339 formatted date time string indicating the start of the shift.                                         | 1985-04-12T23:20:50.52Z |
| EndTime    | An RFC3339 formatted date time string indicating the end of the shift. This must be greater than the start time. | 1985-04-13T07:19:14.03Z |

Note: A week is defined as starting on midnight on Sunday in Central Time, and ends on the following Sunday at midnight.

Using the dataset provided, calculate the following:

- The total number of _regular_ hours worked per employee in a given week. Regular hours are the number of hours worked _up to_ 40 hours.
- The total number of _overtime_ hours worked per employee in a given week. Overtime hours are the number of hours worked beyond 40 hours in a given week.
- If a shift crosses midnight of Sunday, it's calculations should be split between the two weeks.

You should also determine what shifts are "invalid" for a user. Invalid shifts are shifts for a single Employee that overlap
with each other. For example; if you have two shifts, one begins at `8am` and ends at `4pm` and the other begins at
`9am` and ends at `5pm` for the same employee. Both of these shifts would be considered invalid as they overlap.

**Invalid shifts should not be included in an employee's totals**

Your program should output a json in the following format:

```json
[
  {
    "EmployeeID": 456,
    "StartOfWeek": "2021-08-22",
    "RegularHours": 20.56,
    "OvertimeHours": 0,
    "InvalidShifts": [
      123,
      234
    ]
  }
]
```

| Field         | Description                                                                                     |
|---------------|-------------------------------------------------------------------------------------------------|
| EmployeeID    | The ID of the employee for this particular summary object.                                      |
| StartOfWeek   | The date that this week began on in the following format: "YYYY-MM-DD"                          |
| RegularHours  | The total number of regular hours for this employee during this week excluding invalid shifts.  |
| OvertimeHours | The total number of overtime hours for this employee during this week excluding invalid shifts. |
| InvalidShifts | An array of Shift IDs that overlap for this employee during this week.                          |


## Bonus

Your program should be able to properly calculate the regular and overtime hours for a given employee for a week that
transitions from CST to CDT or vice versa. Including shifts that cross midnight.
