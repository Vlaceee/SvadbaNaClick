import React, { Component } from 'react';
import Calendar from 'react-calendar';
// engleski PREVEDENO
class MyApp extends Component {
  constructor(props) {
    super(props);
    const { date } = new Date();
    this.state = { date };
  }

  onChange = (date) => this.setState({ date });

  render() {
    const { date } = this.state;

    return (
      <div>
        <Calendar
          onChange={this.onChange}
          value={date}
          selectRange
        />
      </div>
    );
  }
}

export default function CalendarMultiple() {
  return <MyApp />;
}
