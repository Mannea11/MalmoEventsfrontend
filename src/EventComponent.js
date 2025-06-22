import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './BillettoComponent.css';

const EventComponent = ({ apiUrls }) => {
  const [events, setEvents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const results = await Promise.allSettled(
      apiUrls.map(async url => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.statusText);
          const json = await res.json();
          let arr = [];
          if (Array.isArray(json)) {
            arr = json;
          } else if (json.data && Array.isArray(json.data)) {
            arr = json.data;
          } else if (json.items && Array.isArray(json.items)) {
            arr = json.items;
          } else if (json._embedded && Array.isArray(json._embedded.events)) {
            arr = json._embedded.events;
          }
          const source = urlIncludesBilletto(url) ? 0
                       : urlIncludesTicketmaster(url) ? 1
                       : urlIncludesTickster(url) ? 2 : -1;
          return arr.map(evt => {
            let start = evt.startDate || evt.dateTime || evt.startUtc;
            if (!start && evt.dates && evt.dates.start) {
              start = evt.dates.start.dateTime || `${evt.dates.start.localDate}T${evt.dates.start.localTime||'00:00:00'}`;
            }
            return {
              ...evt,
              source,
              normalizedStart: start,
              normalizedVenue: evt.location?.city || evt.venue?.name || (evt._embedded?.venues?.[0]?.name) || '',
              normalizedTitle: evt.title || evt.name,
              normalizedImage: evt.image || evt.image_link || (evt.images && evt.images[0]?.url) || 'https://i.imgur.com/IDoyRMI.jpeg',
              normalizedEnd: evt.endDate || evt.endUtc || '',
              id: evt.id
            };
          });
        } catch (e) {
          console.error('Fetch error', url, e);
          // Returnera tom array vid fel i just detta anrop för att inte stoppa hela hämtningen
          return [];
        }
      })
    );

    const fulfilledEvents = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    fulfilledEvents.sort((a, b) => new Date(a.normalizedStart) - new Date(b.normalizedStart));
    setEvents(fulfilledEvents);
  }, [apiUrls]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentDate = new Date();
  const isToday = d => new Date(d).toDateString() === currentDate.toDateString();
  const isWithinComingWeek = d => {
    const ed = new Date(d);
    const w = new Date(currentDate);
    w.setDate(w.getDate()+7);
    return ed>=currentDate && ed<=w;
  };
  const isWithinComingMonth = d => {
    const ed = new Date(d);
    const m = new Date(currentDate);
    m.setMonth(m.getMonth()+1);
    return ed>=currentDate && ed<=m;
  };

  const venueNames = Array.from(new Set(events.map(evt => evt.normalizedVenue)));
  const filtered = events.filter(evt => {
    if (selectedVenue && evt.normalizedVenue !== selectedVenue) return false;
    switch (selectedDateFilter) {
      case 'today': return isToday(evt.normalizedStart);
      case 'week': return isWithinComingWeek(evt.normalizedStart);
      case 'month': return isWithinComingMonth(evt.normalizedStart);
      default: return true;
    }
  });

  const handleClick = (id, src) => {
    if (src===0) navigate(`/billettoEvent/${id}`);
    if (src===1) navigate(`/ticketmasterEvent/${id}`);
    if (src===2) navigate(`/ticksterEvent/${id}`);
  };

  return (
    <div>
      <div className="filter-container">
        <select value={selectedVenue} onChange={e=>setSelectedVenue(e.target.value)}>
          <option value="">Alla lokaler</option>
          {venueNames.map((v,i)=><option key={i} value={v}>{v}</option>)}
        </select>
        <select value={selectedDateFilter} onChange={e=>setSelectedDateFilter(e.target.value)}>
          <option value="all">Alla datum</option>
          <option value="today">Idag</option>
          <option value="week">Inom 7 dagar</option>
          <option value="month">Inom 30 dagar</option>
        </select>
      </div>
      <div className="events-container">
        <ul className="event-list">
          {filtered.map(evt => (
            <li key={evt.id} className="event-item" onClick={()=>handleClick(evt.id, evt.source)}>
              <div className="event-content">
                <img src={evt.normalizedImage} alt={evt.normalizedTitle} className="event-image" />
                <h3 className={`event-title ${evt.normalizedTitle.length>20?'event-title-small':''}`}>{evt.normalizedTitle}</h3>
                <p className="event-info">{evt.normalizedVenue}</p>
                <p className="event-info">{formatDate(evt.normalizedStart)}</p>
                {evt.normalizedEnd && <p className="event-info">{formatDate(evt.normalizedEnd)}</p>}
                <button className="more-info-button">Mer Info</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const formatDate = d => new Date(d).toLocaleString(undefined,{year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hour12:false});

const urlIncludesTicketmaster = url => url.includes('ticketmaster');
const urlIncludesBilletto    = url => url.includes('billetto');
const urlIncludesTickster    = url => url.includes('tickster');

export default EventComponent;
