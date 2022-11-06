import { getWeekStartDate } from '../src/time'

const NORMAL_DATE_STR = '2021-08-30T12:30:00.000000Z';

describe( 'Test getWeekStartDate()', () => {
    test( 'Normal test', () => {
        expect( getWeekStartDate( NORMAL_DATE_STR ) ).toBe( '2021-08-29' );
    } );
    test( 'CDT to CST test', () => {
        const startTime = '2022-11-04T12:00:00.00Z';
        const endTime = '2022-11-06T20:00:00.00Z';
        const firstWeek = getWeekStartDate( startTime );
        const secondWeek = getWeekStartDate( endTime );
        expect( firstWeek != secondWeek ).toBe( true );
    } );
});
