import React from 'react';

//API
import API from '../API';

//Config
import { POSTER_SIZE, BACKDROP_SIZE, IMAGE_BASE_URL } from '../config';

//Components
import HeroImage from './HeroImage';
import Grid from './Grid';
import Thumb from './Thumb';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import Button from './Button';

//Hook
import { useHomeFetch } from '../hooks/useHomeFetch'

//Image
import NoImage from '../images/no_image.jpg';


// Components, always capitalized
const Home = () => {

    const {
        state,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        setIsLoadingMore
    } = useHomeFetch();

    console.log(state.results);

    if (error) return <div>Something went wrong ...</div>;

    // Half the times state.results is UNDEFINED (WHY???), so
    // I try to catch it here and assign state.results[0] to
    // the variable res in order to use it.
    var sr = [];
    var sr0 = {};

    (state.results === undefined)
        ? console.log('undefined')
        : ([sr, sr0] = [state.results, state.results[0]]);

    /*const image_url = `${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.results[0].backdrop_path}`;
    const title = state.results[0].original_title;
    const text = state.results[0].overview;*/

    const image_url = `${IMAGE_BASE_URL}${BACKDROP_SIZE}${sr0.backdrop_path}`;
    const title = sr0.original_title;
    const text = sr0.overview;


    return (
        <>
            {!searchTerm && sr0
                ? <HeroImage
                    image={image_url}
                    title={title}
                    text={text}
                />
                : null }

            <SearchBar setSearchTerm={setSearchTerm}/>

            <Grid header={ searchTerm ? 'SearchResults' : 'Popular Movies' }>
                {sr.map(movie => (
                    <Thumb
                        key={movie.id}
                        clickable
                        image={
                            movie.poster_path
                                ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path
                                : NoImage
                        }
                        movieId={movie.id}
                    />
                ))}
            </Grid>

            {loading && <Spinner/>}

            {state.page < state.total_pages && !loading && (
                <Button
                    text='Load More'
                    // changes state to is loading more when click on button
                    callback={() => setIsLoadingMore(true)}
                />
            )}

        </>
    )
};

export default Home;