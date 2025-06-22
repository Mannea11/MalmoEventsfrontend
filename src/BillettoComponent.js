import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BillettoComponent.css';

const ApiComponent = ({ apiUrl }) => {
  const [events, setEvents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [uniqueVenueNames, setUniqueVenueNames] = useState([]);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(json => {
        console.log('API Response:', json);
        const eventsArray = json.data || [];

        const sortedEvents = eventsArray.sort(
          (a, b) => new Date(a.startdate) - new Date(b.startdate)
        );
        setEvents(sortedEvents);

        const venues = [...new Set(
          eventsArray.map(event => event.location?.city || '')
        )];
        setUniqueVenueNames(venues);
      })
      .catch(error => console.error('Error fetching API data:', error));
  }, [apiUrl]);

  const isToday = dateString => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  const isWithinComingWeek = dateString => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    return eventDate >= today && eventDate <= weekLater;
  };

  const isWithinComingMonth = dateString => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const monthLater = new Date(today);
    monthLater.setMonth(monthLater.getMonth() + 1);
    return eventDate >= today && eventDate <= monthLater;
  };


  const handleVenueChange = e => setSelectedVenue(e.target.value);
  const handleDateFilterChange = e => setSelectedDateFilter(e.target.value);

  const filteredEvents = events.filter(event => {
    if (selectedVenue && event.location?.city !== selectedVenue) {
      return false;
    }
    switch (selectedDateFilter) {
      case 'today':
        return isToday(event.startdate);
      case 'week':
        return isWithinComingWeek(event.startdate);
      case 'month':
        return isWithinComingMonth(event.startdate);
      default:
        return true;
    }
  });

  return (
    <div>
      <div className="filter-container">
        <select onChange={handleVenueChange} value={selectedVenue}>
          <option value="">Alla städer</option>
          {uniqueVenueNames.map((city, idx) => (
            <option key={idx} value={city}>{city}</option>
          ))}
        </select>
        <select onChange={handleDateFilterChange} value={selectedDateFilter}>
          <option value="all">Alla datum</option>
          <option value="today">Idag</option>
          <option value="week">Inom 7 dagar</option>
          <option value="month">Inom 30 dagar</option>
        </select>
      </div>

      <div className="events-container">
        <ul className="event-list">
          {filteredEvents.map(event => (
            <li key={event.id} className="event-item">
              <Link to={`/BillettoEvent/${event.id}`} className="event-link">
                <div className="event-content">
                  <img
                    src={event.image_link}
                    alt={event.title}
                    className="event-image"
                  />
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-info">{event.location?.city || ''}</p>
                  <p className="event-info">{formatDate(event.startdate)}</p>
                  {event.enddate && (
                    <p className="event-info">{formatDate(event.enddate)}</p>
                  )}
                  <button className="more-info-button">Mer Info</button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const formatDate = dateString => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

export default ApiComponent;
