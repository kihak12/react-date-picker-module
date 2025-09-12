
import { useState, useEffect, useRef } from 'react';
import styles from './DatePickerComponent.module.css';

export const DatePickerComponent = (props: DatePickerProps) => {
    const datePickerData = {...defaultProps, ...props}

    const [displayDate, setDisplayDate] = useState(datePickerData.selectedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDisplayDate(datePickerData.selectedDate);
    }, [datePickerData.selectedDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDay();
    };

    const formatDate = (date: Date) => {
        const datePart = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        if (datePickerData.timeSelect) {
            const timePart = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            return `${datePart} ${timePart}`;
        }
        return datePart;
    };

    const prevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };

    const selectDay = (date: Date) => {
        if (datePickerData.timeSelect) {
            // Keep current selected time when switching the day
            const hours = props.selectedDate.getHours();
            const minutes = props.selectedDate.getMinutes();
            const withTime = new Date(date);
            withTime.setHours(hours, minutes, 0, 0);
            datePickerData.onChange(withTime);
        } else {
            datePickerData.onChange(date);
        }
    }

    const renderCalendar = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const daysFromPrevMonth = firstDayOfMonth;
        const prevMonthDays = getDaysInMonth(year, month - 1);

        const totalDaysToShow = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
        const daysFromNextMonth = totalDaysToShow - daysInMonth - daysFromPrevMonth;

        const days = [];

        for (let i = 0; i < daysFromPrevMonth; i++) {
            const day = prevMonthDays - daysFromPrevMonth + i + 1;
            days.push({
                day,
                currentMonth: false,
                date: new Date(year, month - 1, day)
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                currentMonth: true,
                date: new Date(year, month, i)
            });
        }

        for (let i = 1; i <= daysFromNextMonth; i++) {
            days.push({
                day: i,
                currentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const today = new Date();

        return (
            <div className={styles.calendar} ref={calendarRef}>
                <div className={styles.calendarHeader}>
                    <button className={styles.navButton} onClick={event => { event.preventDefault(); prevMonth()}}>
                        <img className={styles.arrowIcon} src="/assets/side-arrow.svg" alt=""/>
                    </button>
                    <div className={styles.monthYearDisplay}>
                        {displayDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </div>
                    <button className={styles.navButton} onClick={event => { event.preventDefault(); nextMonth()}}>
                        <img className={`${styles.arrowIcon} ${styles.reversed}`} src="/assets/side-arrow.svg" alt=""/>
                    </button>
                </div>

                <div className={styles.weekdays}>
                    {weekdays.map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className={styles.days}>
                    {days.map((day, index) => {
                        const isSelected = day.currentMonth &&
                            day.day === datePickerData.selectedDate.getDate() &&
                            month === datePickerData.selectedDate.getMonth() &&
                            year === datePickerData.selectedDate.getFullYear();

                        const isToday = day.currentMonth &&
                            day.day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                        const isBeforeMin = datePickerData.minDate ? day.date < new Date(datePickerData.minDate.getFullYear(), datePickerData.minDate.getMonth(), datePickerData.minDate.getDate()) : false;
                        const isAfterMax = datePickerData.maxDate ? day.date > new Date(datePickerData.maxDate.getFullYear(), datePickerData.maxDate.getMonth(), datePickerData.maxDate.getDate()) : false;
                        const isDisabled = isBeforeMin || isAfterMax;

                        return (
                            <div
                                key={index}
                                className={`
                                    ${styles.day}
                                    ${!day.currentMonth ? styles.otherMonthDay : ''}
                                    ${isSelected ? styles.selectedDay : ''}
                                    ${isToday ? styles.today : ''}
                                    ${isDisabled ? styles.disabledDay : ''}
                                `}
                                onClick={() => { if (!isDisabled) selectDay(day.date) }}
                                aria-disabled={isDisabled}
                                role="button"
                            >
                                {day.day}
                            </div>
                        );
                    })}
                </div>
                {datePickerData.timeSelect && (
                    <div className={styles.timeContainer}>
                        <label className={styles.timeLabel}>Heure</label>
                        <div className={styles.timeFields}>
                            <input
                                type="number"
                                min={0}
                                max={23}
                                value={datePickerData.selectedDate.getHours()}
                                onChange={(e) => {
                                    const hours = Math.max(0, Math.min(23, Number(e.target.value)));
                                    const updated = new Date(datePickerData.selectedDate);
                                    updated.setHours(hours);
                                    datePickerData.onChange(updated);
                                }}
                                className={styles.timeInput}
                                aria-label="Hours"
                            />
                            <span className={styles.timeSeparator}>:</span>
                            <input
                                type="number"
                                min={0}
                                max={59}
                                value={datePickerData.selectedDate.getMinutes()}
                                onChange={(e) => {
                                    const minutes = Math.max(0, Math.min(59, Number(e.target.value)));
                                    const updated = new Date(datePickerData.selectedDate);
                                    updated.setMinutes(minutes);
                                    datePickerData.onChange(updated);
                                }}
                                className={styles.timeInput}
                                aria-label="Minutes"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.datePickerContainer}>
            <input
                type="text"
                className={styles.dateInput}
                value={formatDate(datePickerData.selectedDate)}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                readOnly
            />
            {isCalendarOpen && renderCalendar()}
        </div>
    );
}

interface DatePickerProps {
    selectedDate: Date;
    onChange: (date: Date) => void;
    timeSelect?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

const defaultProps: Partial<DatePickerProps> = {
    selectedDate: new Date(),
    onChange: () => {},
    timeSelect: false,
};
