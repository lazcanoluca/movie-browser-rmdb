// Always name custom hooks like use...
import React, { useState, useEffect } from 'react';
//API
import API from '../API';
// Helpers
import { isPersistedState } from '../helpers';

const initialState = {
    page: 0,
    result: [],
    total_pages: 0,
    total_results: 0
}


export const useHomeFetch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false); //if we receive an error from the API
    const [isLoadingMore, setIsLoadingMore] = useState(false);


    const fetchMovies = async (page, searchTerm = '') => {
        try {
            setError(false);
            setLoading(true);

            const movies = await API.fetchMovies(searchTerm, page);

            // State with the movies we fetch.
            // Inline function -> callback function, which calls previous
            // state, because we NEED a prev state (why?) 
            setState(prev => ({ // returns an object
                ...movies,      // spreads the movies in movies. NEVER MUTATE STATE ??
                results:        // results is the property with the movies.
                    page > 1 ? [...prev.results, ...movies.results] : [...movies.results]
            }));     // if the page is greater than 1, spread all the movies already in
        } catch (error) {           // the state, and append new results. Ow, only results.
            setError(true);
        }
        setLoading(false);
    };

    // Initial render & search
    useEffect(() => {
        if (!searchTerm) {
            const sessionState = isPersistedState('homeState');

            if (sessionState) {
                console.log('Grabbing from sessionStorage')
                setState(sessionState);
                return;
            }
        }
        console.log('Grabbing from API');
        setState(initialState);
        fetchMovies(1, searchTerm);
    }, [searchTerm]);

    // Load more
    useEffect(() => {
        if (!isLoadingMore) return;

        fetchMovies(state.page+1, searchTerm);
        setIsLoadingMore(false);

    }, [isLoadingMore, searchTerm, state.page]);

    // Write to sessionStorage
    useEffect(() => {
        if(!searchTerm) sessionStorage.setItem('homeState', JSON.stringify(state));
    }, [searchTerm, state])

    return { state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore };
    // es6 for { state: state, loading: loading, error: error}
};