import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div className="Card" >
        <h1 className="Card-title">{this.props.title}</h1>
        <p className="Card-title">{this.props.artistDisplayBio}</p>

        <div className="Card-image">
          <a href={this.props.objectURL} target="_blank" rel="noopener noreferrer">
            <img src={this.props.primaryImageSmall} alt={this.props.title} />
          </a>
        </div>
      </div >
    );
  }
}

export default Card;