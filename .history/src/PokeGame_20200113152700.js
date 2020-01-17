import React, { Component } from 'react'
import Pokedex from './Pokedex';
import Axios from 'axios';

class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                objectIDs: []
            }
        }
    }
    static defaultProps = {
        pokemon: [
            { id: 4, name: 'Charmander', type: 'fire', base_experience: 62 },
            { id: 7, name: 'Squirtle', type: 'water', base_experience: 63 },
            { id: 11, name: 'Metapod', type: 'bug', base_experience: 72 },
            { id: 12, name: 'Butterfree', type: 'flying', base_experience: 178 },
            { id: 25, name: 'Pikachu', type: 'electric', base_experience: 112 },
            { id: 39, name: 'Jigglypuff', type: 'normal', base_experience: 95 },
            { id: 94, name: 'Gengar', type: 'poison', base_experience: 225 },
            { id: 133, name: 'Eevee', type: 'normal', base_experience: 65 }
        ]
    }
    componentDidMount() {
        console.log('cdm');
        Axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflower').then((response) => {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
            this.setState({ data: response.data });
          });
    }
    render() {
        return (
            <div>
                {this.state.data.map(object => <p>object</p>)}
                {/* <Pokedex pokemon={hand1} exp={exp1} isWinner={exp1 > exp2} /> */}
                {/* <Pokedex pokemon={hand2} exp={exp2} isWinner={exp2 > exp1} /> */}
            </div>
        )
    }
}

export default PokeGame;