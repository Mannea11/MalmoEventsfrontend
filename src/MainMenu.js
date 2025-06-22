import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const MainMenu = () => {
  const [activeLink, setActiveLink] = useState(0);


  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  return (
    <div className="main-menu">
      <div className="menu-image"></div>

      <Link to="/allEvents" className={activeLink === 0 ? 'active' : ''} onClick={() => handleLinkClick(0)}>
        Alla Evenemang
      </Link>
      <Link to="/ticketmaster" className={activeLink === 1 ? 'active' : ''} onClick={() => handleLinkClick(1)}>
        TicketMaster
      </Link>
      <Link to="/billetto" className={activeLink === 2 ? 'active' : ''} onClick={() => handleLinkClick(2)}>
        Billetto
      </Link>
      <Link to="/tickster" className={activeLink === 3 ? 'active' : ''} onClick={() => handleLinkClick(3)}>
        Tickster
      </Link>
      <Link to="/musik" className={activeLink === 4 ? 'active' : ''} onClick={() => handleLinkClick(4)}>
        Musik
      </Link>
      <Link to="/mat" className={activeLink === 5 ? 'active' : ''} onClick={() => handleLinkClick(5)}>
        Mat & Dryck
      </Link>
      <Link to="/scenkonst" className={activeLink === 6 ? 'active' : ''} onClick={() => handleLinkClick(6)}>
        Scenkonst
      </Link>
      <Link to="/film" className={activeLink === 7 ? 'active' : ''} onClick={() => handleLinkClick(7)}>
        Film
      </Link>
      <Link to="/sport" className={activeLink === 8 ? 'active' : ''} onClick={() => handleLinkClick(8)}>
        Sport
      </Link>
      <Link to="/om" className={activeLink === 9 ? 'active' : ''} onClick={() => handleLinkClick(9)}>
        Om
      </Link>
    </div>
  );
};

export default MainMenu;
