import React, { Component } from 'react'
// import Pokedex from './Pokedex';
import Axios from 'axios';
import Pokecard from './Pokecard';
// import './Pokedex.css';
const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';


class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objects: [],
            searchTerm: ''
        }
        this.handleSearchInputChanges = this.handleSearchInputChanges.bind(this);
    }
    // static defaultProps = {
    //     test: [
    //     ]
    // }
    handleSearchInputChanges(e) {
        this.setState({ searchTerm: e.target.value })
        // console.log(this.state.searchTerm);
        this.search(e.target.value);
    }
    search(searchTerm) {
        Axios.get(`${MET_API_BASE}/search?q=${searchTerm}`).then((response) => {
            // console.log(response.data.objectIDs.slice(0, 20));
            // console.log(response.status, response.statusText);
            console.log('RESPONSE', response);
            if (response.data.objectIDs) {
                const objectIDs = response.data.objectIDs.slice(0, 20);
                objectIDs.forEach((id, idx) => {
                    Axios.get(`${MET_API_BASE}/objects/${id}`).then((response) => {
                        // console.log(idx, response.data);
                        const newObjects = [...this.state.objects];
                        newObjects.push(response.data);
                        this.setState({ objects: newObjects })
                    })
                });
            } else {
                this.setState({ objects: []] })

            }
        });
    }
    componentDidMount() {
        console.log('didMount');
    }
    render() {
        return (
            <div className='Pokedex'>
                <input type="text" placeholder="Search the MET art collection..." onChange={this.handleSearchInputChanges} />
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