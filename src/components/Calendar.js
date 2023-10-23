import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./styles.css"
import Modal from 'react-modal'
import axios from 'axios'

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: moment().startOf('day').toDate(),
    end: moment().startOf('day').toDate(),
    slot_validity_from: moment().startOf('day').toDate(),
    slot_validity_till: moment().endOf('day').toDate(),
    // repeat: {
    //   M: false,
    //   T: false,
    //   W: false,
    //   Th: false,
    //   F: false,
    //   Sa: false,
    //   Su: false,
    // },
  });

  const [appointments, setAppointments] = useState();

  useEffect(() => {
    // Define a function to fetch appointments
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/appointments/');
        // Assuming the API returns an array of appointments
        setAppointments(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    // Call the fetchAppointments function within the useEffect
    fetchAppointments();
  }, []);

  const handleSelect = ({ start, end }) => {
    setShowEventForm(true);
    console.log(events);
  };

  const openForm = () => {
    setShowEventForm(true)
  }

  function doesOverlap(newStart, newEnd, events) {
    // Loop through the events array
    for (const event of events) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
  
      // Check for overlap
      if (newStart < eventEnd && newEnd > eventStart) {
        // There is an overlap
        return true;
      }
    }
  
    // No overlap found
    return false;
  }

  const handleAddEvent = () => {
    if (doesOverlap(newEvent.start, newEvent.end, events)){
      alert("Sorry, please chose a different time period as this one is occupied.")
    } else {
      axios.post('http://127.0.0.1:8000/api/appointments/', newEvent)
        .then(response => {
          console.log('POST request success:', response.data);
        })
        .catch(error => {
          console.error('POST request error:', error);
        });
      setEvents([...events, newEvent]);
      setShowEventForm(false);
    }

  };


  const customStyles = {
    content: {
      marginTop: '300px',
      height: '200px',
      width: '500px',
      alignItems: 'centre',
      marginLeft: '540px'
    },
  };

  const eventList = events.map((event, index) => (
    <div>
    <div key={index} className='card'>
      <div className='card-body'>
      <p>Title: {event.title}</p>
      <p>Start: {event.start.toString()}</p>
      <p>End: {event.end.toString()}</p>
      
      </div>
    </div>
    <br />
    </div>
  ));
  

  return (
    <div>
      <div className='header'>
        <h4>Book Slot{`(s)`}</h4>
      </div>
      <div className='row'>
        <div className='calendar-view col-8'>
          <Calendar
            selectable
            // style={customStyles}
            localizer={localizer}
            events={events}
            defaultView='week'
            views={['month', 'week', 'day']}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            // onSelectEvent={() => setShowEventForm(true)}
            onSelectSlot={handleSelect}
            onSelectEvent={openForm}
            onDoubleClickEvent={handleSelect}
          />
        </div>
        <div className='col-4'>
          <div className='row'>My Booked Slots</div><br />
          <div className='row'>
            <div className='col'>
            <button className='btn btn-primary' onClick={() => setShowEventForm(true)}>Book Slot</button><br />
            {eventList}
            </div>
            <div className='col'></div>
          
          </div>
        </div>
      </div>

      {showEventForm && (
        <Modal className="modal-form"
        appElement={document.getElementById('root')}
        isOpen={showEventForm}
        style={customStyles}
        contentLabel="Add Event Modal"
      >
        <h2>Add Event</h2>
        <input
        className='form-control'
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <div>
          <label>Slot Validity From:</label>
          <input
            className='form-control'
            type="datetime-local"
            value={moment(newEvent.slot_validity_from).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                slot_validity_from: moment(e.target.value).toDate(),
              })
            }
          />
        </div>
        <div>
          <label>Slot Validity To:</label>
          <input
            type="datetime-local"
            className='form-control'
            value={moment(newEvent.slot_validity_till).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                slot_validity_till: moment(e.target.value).toDate(),
              })
            }
          />
        </div>
        <div>
          <label>Start:</label>
          <input
            type="datetime-local"
            className='form-control'
            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                start: moment(e.target.value).toDate(),
              })
            }
          />
        </div>
        <div>
          <label>End:</label>
          <input
            type="datetime-local"
            className='form-control'
            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                end: moment(e.target.value).toDate(),
              })
            }
          />
        </div>
        <div>
          <label>Repeat:</label>
          {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map(day => (
            <label key={day}>
              <input
              
                type="checkbox"
                // checked={newEvent.repeat[day]}
                // onChange={(e) =>
                //   setNewEvent({
                //     ...newEvent,
                //     repeat: {
                //       ...newEvent.repeat,
                //       [day]: e.target.checked,
                //     },
                //   })
                // }
              />
              {day}
            </label>
          ))}
        </div>
        <button className='btn btn-primary' onClick={handleAddEvent}>Add Event</button>
        <button className='btn btn-primary' onClick={() => setShowEventForm(false)}>Close</button>
      </Modal>
      )}
      </div>
  );
};

export default MyCalendar;