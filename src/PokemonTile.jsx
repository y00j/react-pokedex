import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


export default function PokemonTile({ url,name }) {

    const [pokemon, setPokemon] = useState({sprite: null});

    useEffect(() => {
        const getPokemon = async () => {
            const res = await fetch(url);
            const json = await res.json();
            console.log('tile', json);
            setPokemon({sprite: json.sprites.front_default});
        }

        getPokemon();
    }, [url])

    return (
        <>
            <p>{name}</p>
            <img src={pokemon.sprite}></img>
        </>
    )
}

PokemonTile.propTypes = {
    url: PropTypes.string.isRequired, // or PropTypes.string if it's not required
    name: PropTypes.string.isRequired
  };