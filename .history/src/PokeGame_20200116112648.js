import React, { Component } from 'react'
// import Pokedex from './Pokedex';
import Axios from 'axios';
import Pokecard from './Pokecard';
// import './Pokedex.css';
const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}


class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objects: [],
            searchTerm: '',
            searching: false
        }
        this.handleSearchInputChanges = this.handleSearchInputChanges.bind(this);
        this.search = debounce(this.search, 300);
    }
    // static defaultProps = {
    //     test: [
    //     ]
    // }
    handleSearchInputChanges(e) {
        const searchTerm =  e.target.value;
        this.setState({ searchTerm })
        // console.log(this.state.searchTerm);
        this.search(searchTerm);
    }
    search(searchTerm) {
        console.log('searchTerm state', this.state.searchTerm);
        console.log('searchTerm local', searchTerm);
        
        Axios.get(`${MET_API_BASE}/search?q=${searchTerm}`).then((response) => {
            this.setState({ objects: [], searching: true })
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
                this.setState({ objects: [] })
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
                {!this.state.objects.length && !this.state.searching && <p>No results (yet). Enter your search term above.</p>}
                {this.state.searching && <p>Searching...</p>}

            </div>
        )
    }
}

export default PokeGame;