import React, { Component } from 'react'
// import Pokedex from './Pokedex';
import Axios from 'axios';

class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectIDs: []
        }
    }
    static defaultProps = {
        test: [
        ]
    }
    componentDidMount() {
        console.log('cdm');
        Axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflower').then((response) => {
            console.log(response.data.objectIDs.slice(0, 20));
            console.log(response.status, response.statusText);
           const objectIDs = response.data.objectIDs.slice(0,20);
            objectIDs.forEach((id, idx) => {
                Axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then((response) => {
                    console.log(idx, response.data);
                    const newObjects = [...this.state.objects]
                    this.setState
                })
            });
          });
    }
    render() {
        return (
            <div>
                {this.state.objectIDs.map(object => <p>{object}</p>)}
                {/* <Pokedex pokemon={hand1} exp={exp1} isWinner={exp1 > exp2} /> */}
                {/* <Pokedex pokemon={hand2} exp={exp2} isWinner={exp2 > exp1} /> */}
            </div>
        )
    }
}

export default PokeGame;