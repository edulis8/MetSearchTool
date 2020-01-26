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
                                    setArtObjects([...resultArtObjects]);
                                });
                        }
                    } else {
                        // if no results from the API, clear art objects
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
