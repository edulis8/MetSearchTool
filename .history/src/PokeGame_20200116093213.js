import React, { Component } from 'react'
// import Pokedex from './Pokedex';
import Axios from 'axios';
import Pokecard from './Pokecard';
// import './Pokedex.css';



class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objects: []
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
                    const newObjects = [...this.state.objects];
                    newObjects.push(response.data);
                    this.setState({ objects: newObjects })
                })
            });
          });
    }
    render() {
        return (
            <div className='Pokedex'>
                <input type='text' placeholder="Search the MET art collection/>
                {this.state.objects.map(object => 
                    // <img src={object.primaryImage}></img>
                    <div className='Pokedex-cards'>
                        <Pokecard {...object} />
                    </div>

                )}
                {/* <Pokedex pokemon={hand1} exp={exp1} isWinner={exp1 > exp2} /> */}
            </div>
        )
    }
}

export default PokeGame;