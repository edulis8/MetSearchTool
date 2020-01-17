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
            searching: false,
            dirty: false
        }
        this.handleSearchInputChanges = this.handleSearchInputChanges.bind(this);
        this.search = debounce(this.search, 300);
    }
    // static defaultProps = {
    //     test: [
    //     ]
    // }
    handleSearchInputChanges(e) {
        const searchTerm = e.target.value;
        this.setState({ searchTerm, dirty: true })
        // console.log(this.state.searchTerm);
        this.search(searchTerm);
    }
    search(searchTerm) {
        console.log('searchTerm state', this.state.searchTerm);
        console.log('searchTerm local', searchTerm);
        this.setState({ objects: [], searching: true })

        Axios.get(`${MET_API_BASE}/search?q=${searchTerm}`).then((response) => {
            // console.log(response.data.objectIDs.slice(0, 20));
            // console.log(response.status, response.statusText);
            console.log('RESPONSE', response);
            if (response.data.objectIDs) {
                const objectIDs = response.data.objectIDs.slice(0, 20);
                objectIDs.forEach((id, idx) => {
                    Axios.get(`${MET_API_BASE}/objects/${id}`).then((response) => {
                        // console.log(idx, response.data);
                        const newObjects = [...this.state.objects, response.data];
                        // newObjects.push(response.data);
                        this.setState({ objects: newObjects, searching: false })
                    })
                });
            } else {
                this.setState({ objects: [], searching: false })
            }
        });
    }
    componentDidMount() {
        console.log('didMount');
    }
    render() {
        return (
            <div className='Pokedex'>
                {/* <p>{this.state.objects.length}</p> */}
                {/* <p>{this.state.searching.toString()}</p> */}

                <input type="text" placeholder="Search the MET art collection..." onChange={this.handleSearchInputChanges} />
                <div class="Pokedex-cards">
                    {this.state.objects.map(object =>
                        <div className='Pokedex-cards'>
                            <Pokecard {...object} />
                        </div>

                    )}
                    {!this.state.dirty && !this.state.objects.length && !this.state.searching && <p>No results. </p>}
                    {this.state.searching && <p>Searching...</p>}
                </div>
            </div>
        )
    }
}

export default PokeGame;