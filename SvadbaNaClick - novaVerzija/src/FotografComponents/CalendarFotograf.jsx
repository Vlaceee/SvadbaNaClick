import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

// engleski PREVEDENO
export default function CalendarFotograf({ setSelectedDate }) {
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  CalendarFotograf.propTypes = {
    setSelectedDate: PropTypes.func.isRequired,
  };
  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['StaticDateTimePicker']}>
        <DemoItem classname="font-bold text-center">
          <div style={{
            maxWidth: '100%', overflow: 'clip', width: '100vh',
          }}
          >
            {/* Set width and position:relative on the parent container */}
            <StaticDateTimePicker
              defaultValue={dayjs('2022-04-17T15:30')}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onChange={handleDateChange}
            />
          </div>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
