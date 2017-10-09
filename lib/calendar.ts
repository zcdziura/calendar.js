export class Calendar {
    private firstWeekDay: number;
    public months: object = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11
    };

    constructor(firstWeekDay?: number) {
        this.firstWeekDay = firstWeekDay || 0;
    }

    monthDates(year: number, month: number,
        dayFormatter?: (d: Date) => string,
        weekFormatter?: (week: (number | string | Date)[]) => (number | string)[])
        : (string | number)[][] {

        if (year < 1970) {
            throw new CalendarException('Year must be a number >= 1970');
        };

        if (month < 0 || month > 11) {
            throw new CalendarException('Month must be a number (Jan is 0)');
        }

        let weeksInMonth: Date[][] = [],
            week: Date[] = [],
            i: number = 0,
            date: Date = this.weekStartDate(new Date(year, month, 1));

        // Create each week in the month, as an array of seven Date objects
        do {
            for (let i = 0; i < 7; i++) {
                week.push(date);
                date.setDate(date.getDate() + 1);
            }

            weeksInMonth.push(week);
            week = []
        } while ((date.getMonth() <= month) && (date.getFullYear() === year));

        // Format the values to be either an array of an array of numbers or formatted strings
        return weeksInMonth.map(week => {
            let formattedWeek = week.map(day => {
                if (dayFormatter) {
                    return dayFormatter(day);
                } else {
                    return day.getDate();
                }
            });

            if (weekFormatter) {
                return weekFormatter(formattedWeek);
            } else {
                return formattedWeek;
            }
        });
    }

    monthDays(year: number, month: number): (string | number)[][] {
        let getDayOrZero = (date: Date): string => {
            return date.getMonth() === month ? `${date.getDate()}` : '0';
        }

        return this.monthDates(year, month, getDayOrZero);
    }

    weekStartDate(date: Date): Date {
        let startDate = new Date(date.getTime());

        while (startDate.getDay() !== this.firstWeekDay) {
            startDate.setDate(startDate.getDate() - 1);
        }

        return startDate;
    }
}

export class CalendarException extends Error {
    constructor(message: string) {
        super(message);
    }

    toString(): string {
        return `${this.constructor.name}: ${this.message}`;
    }
}