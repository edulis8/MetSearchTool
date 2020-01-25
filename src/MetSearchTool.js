import React, { Component, useRef, useState, useEffect } from 'react';
import Card from './Card';

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
};

const MetSearchTool = () => {
    const lastPromise = useRef();
    const lastAbortController = useRef();
    const [artObjects, setArtObjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSetSearchTerm = debounce(setSearchTerm, 400);
    const handleSearchInputChanges = (e) => {
        debouncedSetSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (!searchTerm) { 
            return; 
        }
        // When a new request is going to be issued, the first thing to do is cancel the previous request
        if (lastAbortController.current) {
            lastAbortController.current.abort();
        }
        const currentAbortController = new AbortController();
        lastAbortController.current = currentAbortController;
        setArtObjects([]);
        searchArtAPI(currentAbortController);
    }, [searchTerm]);


    const searchArtAPI = (abortController) => {
        const currentPromise = fetch(`${MET_API_BASE}/search?q=${searchTerm}`, { signal: abortController.signal })
            .then(response => {
                if (abortController.signal.aborted) {
                    // cancel former API call by returning empty promise
                    return new Promise(() => {});
                }
                return response;
            });

        // store the promise from the newest API call to the ref
        lastPromise.current = currentPromise;
        currentPromise.then(
            async response => {
                // ignore responses from API calls that have been superceded by new user imput; only continue with latest promise
                if (currentPromise === lastPromise.current) {
                    const data = await response.json();
                    console.log('data', data);
                    if (data.objectIDs) {
                        const resultArtObjects = [];
                        for (let i = 0; i < 20; i++) {
                            const id = data.objectIDs[i];
                            fetch(`${MET_API_BASE}/objects/${id}`).then(
                                async response => {
                                    const objectData = await response.json();
                                    resultArtObjects.push(objectData);
                                    console.log('pushing');
                                    setArtObjects([...resultArtObjects]);
                                });
                        }
                    } else {
                        console.log('No results from API');
                        setArtObjects([]);
                    }
                }
            });

    };
    return (
        <div className='Container'>
            <h1>Search the Metropolitan Museum of Art Collection</h1>
            <input type="text" placeholder="Search the MET..." onChange={handleSearchInputChanges} />
            <p>{searchTerm && `searching for: ${searchTerm}`}</p>
            <p>{searchTerm && `${artObjects.length} results`}</p>
            <div className="Container-cards">
                {artObjects.map(object =>
                    <div className='Container-cards' key={object.objectID}>
                        <Card {...object} />
                    </div>
                )}
                {/* {!this.state.dirty && <p>Welcome. Search for art at the MET!</p>} */}
                {/* {this.state.dirty && !this.state.artObjects.length && !this.state.searching && <p>No results.</p>} */}
                {/* {this.state.searching && <p>Searching...</p>} */}

            </div>

        </div>
    )

}

export default MetSearchTool;

// class MetSearchTool extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             artObjects: [],
//             searchTerm: '',
//             searching: false,
//             dirty: false
//         }
//         this.handleSearchInputChanges = this.handleSearchInputChanges.bind(this);
//         this.search = debounce(this.search, 300);
//         const lastPromise = useRef();

//     }
//     // static defaultProps = {
//     //     test: [
//     //     ]
//     // }
//     handleSearchInputChanges(e) {
//         const searchTerm = e.target.value;
//         this.setState({ searchTerm, dirty: true, searching: true })
//         // console.log(this.state.searchTerm);
//         this.search(searchTerm);
//     }
//     search(searchTerm) {
//         console.log('searchTerm state', this.state.searchTerm);
//         console.log('searchTerm local', searchTerm);

//         const currentPromise = Axios.get(`${MET_API_BASE}/search?q=${searchTerm}`)
//             .then(async response => {
//                 await delayRandomly();
//                 // throwRandomly();
//                 return response;
//             });

//         // store the promise to the ref
//         lastPromise.current = currentPromise;

//         currentPromise.then((response) => {
//             if (currentPromise === lastPromise.current) {
//                 // console.log(response.data.objectIDs.slice(0, 20));
//                 // console.log(response.status, response.statusText);
//                 console.log('RESPONSE', response);
//                 if (response.data.objectIDs && response.data.total) {
//                     for (let i = 0; i < 20; i++) {
//                         const id = response.data.objectIDs[i];
//                         Axios.get(`${MET_API_BASE}/artObjects/${id}`).then((response) => {
//                             // console.log(idx, response.data);
//                             const newObjects = [...this.state.artObjects, response.data];
//                             // newObjects.push(response.data);
//                             this.setState({ artObjects: newObjects.slice(0, 20), searching: false })
//                             // break loop if search term changes
//                         })
//                     }
//                 } else {
//                     console.log('else')
//                     this.setState({ artObjects: [], searching: false })
//                 }
//             }
//             this.setState({ artObjects: [] })
//         }, 
//         e => {
//             if (currentPromise === lastPromise.current) {
//                 console.warn('fetch failure', e);
//             }
//         });
//     }
//     componentDidMount() {
//         console.log('didMount');
//     }
//     render() {
//         return (
//             <div className='Pokedex'>
//                 {/* <p>{this.state.artObjects.length}</p> */}
//                 {/* <p>{this.state.searching.toString()}</p> */}

//                 <input type="text" placeholder="Search the MET art collection..." onChange={this.handleSearchInputChanges} />
//                 <div class="Pokedex-cards">
//                     {this.state.artObjects.map(object =>
//                         <div className='Pokedex-cards'>
//                             <Pokecard {...object} />
//                         </div>

//                     )}
//                     {!this.state.dirty && <p>Welcome. Search for art at the MET!</p>}
//                     {this.state.dirty && !this.state.artObjects.length && !this.state.searching && <p>No results.</p>}
//                     {this.state.searching && <p>Searching...</p>}
//                 </div>
//             </div>
//         )
//     }
// }

