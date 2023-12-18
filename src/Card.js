import React, { useState } from 'react';
import './Card.css';

const Card = (props) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="Card" >
      <a href={props.objectURL} target="_blank" rel="noopener noreferrer">
        <h2 className="Card-title">{props.title}</h2>
        <p className="Card-subtitle">{props.medium}</p>
        <div
          className="Card-image"
          onMouseOver={() => setShowInfo(!showInfo)}
          onMouseOut={() => setShowInfo(!showInfo)}
        >
          <img src={props.primaryImageSmall} alt={props.title} />
          <div className={`Card-info ${showInfo ? "show-info" : ""}`}>
            <p className="Card-info-snippet">Department: {props.department}</p>
            <p className="Card-info-snippet">Date: {props.objectDate}</p>
            <p className="Card-info-snippet">Artist: {props.artistDisplayName}</p>
          </div>
        </div>
      </a>
    </div >
  );
}

export default Card;