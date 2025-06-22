import React, { useEffect, useState, useCallback } from 'react';
import './BillettoComponent.css';
import { Link } from 'react-router-dom';

const ApiComponent = ({ apiUrl }) => {
  const [events, setEvents] = useState([]);
  const [uniqueVenueNames, setUniqueVenueNames] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');


  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(response.statusText);
      const json = await response.json();
      console.log('API Response:', json);


      const eventsArray = json.items || [];


      const sortedEvents = eventsArray.sort(
        (a, b) => new Date(a.startUtc) - new Date(b.startUtc)
      );
      setEvents(sortedEvents);


      const venues = [...new Set(
        eventsArray.map(evt => evt.venue?.name || '')
      )];
      setUniqueVenueNames(venues);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


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


  const filteredEvents = events.filter(evt => {
    if (selectedVenue && evt.venue?.name !== selectedVenue) return false;

    switch (selectedDateFilter) {
      case 'today':
        return isToday(evt.startUtc);
      case 'week':
        return isWithinComingWeek(evt.startUtc);
      case 'month':
        return isWithinComingMonth(evt.startUtc);
      default:
        return true;
    }
  });

  return (
    <div>
      <div className="filter-container">
        <select value={selectedVenue} onChange={handleVenueChange}>
          <option value="">Alla lokaler</option>
          {uniqueVenueNames.map((venue, idx) => (
            <option key={idx} value={venue}>{venue}</option>
          ))}
        </select>
        <select value={selectedDateFilter} onChange={handleDateFilterChange}>
          <option value="all">Alla datum</option>
          <option value="today">Idag</option>
          <option value="week">Inom 7 dagar</option>
          <option value="month">Inom 30 dagar</option>
        </select>
      </div>

      <div className="events-container">
        <ul className="event-list">
          {filteredEvents.map(evt => (
            <li key={evt.id} className="event-item">
              <Link to={`/ticksterEvent/${evt.id}`} className="event-link">
                <div className="event-content">
                  <img
                    src={evt._links?.find(link => link.rel === 'self')?.href || ''}
                    alt={evt.name}
                    className="event-image"
                  />
                  <h3 className={`event-title ${evt.name.length > 20 ? 'event-title-small' : ''}`}>
                    {evt.name}
                  </h3>
                  <p className="event-info">{evt.venue?.name || ''}</p>
                  <p className="event-info">{formatDate(evt.startUtc)}</p>
                  <p className="event-info">{formatDate(evt.endUtc)}</p>
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
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
  return new Date(dateString).toLocaleString(undefined, options);
};

export default ApiComponent;
