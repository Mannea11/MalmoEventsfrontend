
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './MainMenu';
import BillettoComponent from './BillettoComponent';
import EventComponent from './EventComponent';
import TicketMasterComponent from './TicketMasterComponent';
import TicksterComponent from './TicksterComponent';
import BillettoEventDetail from './BillettoEventDetail';
import TicketMasterEventDetail from './TicketMasterEventDetail';
import TicksterEventDetail from './TicksterEventDetail'
import About from './About';
import './App.css';



const App = () => {
  const billettoApiUrl = 'https://malmoeventsbackend.onrender.com/billetto/all';
  const ticketMasterApiUrl = 'https://malmoeventsbackend.onrender.com/ticketmaster/all';
  const ticksterApiUrl = 'https://malmoeventsbackend.onrender.com/tickster/all';

  const billettoMusicUrl = 'https://malmoeventsbackend.onrender.com/billetto/category/music'
  const billettoFoodUrl = 'https://malmoeventsbackend.onrender.com/billetto/category/food_drink'
  const billettoPerformingArtsUrl = 'https://malmoeventsbackend.onrender.com/billetto/category/performing_arts'
  const billettoMoviesUrl = 'https://malmoeventsbackend.onrender.com/billetto/category/film_media'

  const ticksterMusicUrl = 'https://malmoeventsbackend.onrender.com/tickster/category/music'
  const ticksterPerformingArtsUrl = 'https://malmoeventsbackend.onrender.com/tickster/category/scenkonst'

  const ticketmasterMusicUrl = 'https://malmoeventsbackend.onrender.com/ticketmaster/category/KZFzniwnSyZfZ7v7nJ'
  const ticketmasterSportUrl = 'https://malmoeventsbackend.onrender.com/ticketmaster/category/KZFzniwnSyZfZ7v7nE'
  const ticketmasterPerformingArtsUrl = 'https://malmoeventsbackend.onrender.com/ticketmaster/category/KZFzniwnSyZfZ7v7na'

  return (
    <Router>
      <div className="app-container">
        <MainMenu />
        <Routes>
          <Route path="/allEvents" element={<EventComponent apiUrls={[billettoApiUrl, ticketMasterApiUrl, ticksterApiUrl]} />} />
          <Route path="/billetto" element={<BillettoComponent apiUrl={billettoApiUrl} />} />
          <Route path="/ticketmaster" element={<TicketMasterComponent apiUrl={ticketMasterApiUrl} />} />
          <Route path="/tickster" element={<TicksterComponent apiUrl={ticksterApiUrl} />} />
          <Route path="/musik" element={<EventComponent apiUrls={[billettoMusicUrl,ticksterMusicUrl,ticketmasterMusicUrl]} />} />
          <Route path="/mat" element={<EventComponent apiUrls={[billettoFoodUrl]} />} />
          <Route path="/scenkonst" element={<EventComponent apiUrls={[billettoPerformingArtsUrl, ticksterPerformingArtsUrl,ticketmasterPerformingArtsUrl]} />} />
          <Route path="/film" element={<EventComponent apiUrls={[billettoMoviesUrl]} />} />
          <Route path="/sport" element={<EventComponent apiUrls={[ticketmasterSportUrl]} />} />
          <Route path="/" element={<EventComponent apiUrls={[billettoApiUrl, ticketMasterApiUrl, ticksterApiUrl]} />} />
          <Route path="/BillettoEvent/:eventId" element={<BillettoEventDetail/>} />
          <Route path="/ticketmasterEvent/:eventId" element={<TicketMasterEventDetail />} />
          <Route path="/ticksterEvent/:eventId" element={<TicksterEventDetail />} />
          <Route path="/om" element={<About />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
