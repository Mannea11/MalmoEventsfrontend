// EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import './EventDetails.css';

const EventDetail = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/billetto/${eventId}`);
        const data = await response.json();
        setEventDetails(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!eventDetails) {
    return <div>Loading...</div>;
  }
  const goBack = () => {
    navigate(-1);
  };
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    return new Date(dateString).toLocaleString('sv-SE', options);
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`event-detail-container ${expanded ? 'expanded' : ''}`}>
      <div className="back-button" onClick={goBack}>
        &#8592; Tillbaka
      </div>
      <img src={eventDetails.image} alt={eventDetails.title} />
      <div className="event-details-box">
        <h2>{eventDetails.title}</h2>
        <p onClick={toggleDescription} className={expanded ? 'expanded' : ''}>
        {expanded ? (
          <>
            {eventDetails.description}{' '}
            <span className="read-more-link" onClick={toggleDescription}>
              Läs mindre
            </span>
          </>
        ) : (
          <>
            {`${eventDetails.description.slice(0, 70)}... `}
            <span className="read-more-link" onClick={toggleDescription}>
              Läs mer
            </span>
          </>
        )}
      </p>
        <p>Start: {formatDate(eventDetails.startDate)}</p>
        <p>Slut: {formatDate(eventDetails.endDate)}</p>
        <p>Lokal: {eventDetails.locationObj}</p>
        <p>Lägsta Pris: {eventDetails.minPrice} SEK</p>
        <p>
        <a className="buy-ticket-link" href={eventDetails.url} target="_blank" rel="noopener noreferrer">
        Köp biljett här </a>
        </p>

        <iframe
          title="Google Map"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAqYBLBOkE7lBSq3J9MT-TVJYVgxuGvKv0&q=${eventDetails.longitude},${eventDetails.latitude}&zoom=17&maptype=satellite`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default EventDetail;
