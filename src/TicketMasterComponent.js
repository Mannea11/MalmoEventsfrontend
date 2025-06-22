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

   
      const eventsArray = (json._embedded && json._embedded.events) || [];

   
      const sortedEvents = eventsArray.sort((a,b) => {
        const dtA = a.dates.start.dateTime || `${a.dates.start.localDate}T${a.dates.start.localTime||'00:00:00'}`;
        const dtB = b.dates.start.dateTime || `${b.dates.start.localDate}T${b.dates.start.localTime||'00:00:00'}`;
        return new Date(dtA) - new Date(dtB);
      });
      setEvents(sortedEvents);

      const venueNames = (json._embedded.venues||[]).map(v=>v.name);
      setUniqueVenueNames(Array.from(new Set(venueNames)));
    } catch (e) {
      console.error('Error fetching API data:', e);
    }
  }, [apiUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);


  const isToday = d=>new Date(d).toDateString()===new Date().toDateString();
  const isWithinComingWeek = d=>{ const ed=new Date(d), t=new Date(), w=new Date(); w.setDate(t.getDate()+7); return ed>=t && ed<=w; };
  const isWithinComingMonth = d=>{ const ed=new Date(d), t=new Date(), m=new Date(); m.setMonth(t.getMonth()+1); return ed>=t && ed<=m; };

  const handleVenueChange = e=>setSelectedVenue(e.target.value);
  const handleDateFilterChange = e=>setSelectedDateFilter(e.target.value);

  const filteredEvents = events.filter(evt=>{
    const venue = evt._embedded?.venues?.[0]?.name||'';
    if(selectedVenue && venue!==selectedVenue) return false;
    const startDT = evt.dates.start.dateTime || `${evt.dates.start.localDate}T${evt.dates.start.localTime||'00:00:00'}`;
    switch(selectedDateFilter){
      case 'today': return isToday(startDT);
      case 'week': return isWithinComingWeek(startDT);
      case 'month': return isWithinComingMonth(startDT);
      default: return true;
    }
  });

  return (
    <div>
      <div className="filter-container">
        <select value={selectedVenue} onChange={handleVenueChange}>
          <option value="">Alla lokaler</option>
          {uniqueVenueNames.map((vn,i)=>(<option key={i} value={vn}>{vn}</option>))}
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
          {filteredEvents.map(evt=>{
            const venue = evt._embedded?.venues?.[0];
            const imgObj = evt.images?.find(img=>img.ratio==='16_9')||evt.images?.[0];
            const startDT = evt.dates.start.dateTime || `${evt.dates.start.localDate}T${evt.dates.start.localTime||'00:00:00'}`;
            return (
              <li key={evt.id} className="event-item">
                <Link to={`/ticketmasterEvent/${evt.id}`} className="event-link">
                  <div className="event-content">
                    <img src={imgObj?.url} alt={evt.name} className="event-image" />
                    <h3 className={`event-title ${evt.name.length>20?'event-title-small':''}`}>{evt.name}</h3>
                    <p className="event-info">{venue?.name}</p>
                    <p className="event-info">{formatDate(startDT)}</p>
                    <button className="more-info-button">Mer Info</button>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const formatDate=d=>new Date(d).toLocaleString(undefined,{year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hour12:false});

export default ApiComponent;
