import { useState, useEffect, useRef } from 'react'
import PokemonTile from './PokemonTile';
import './App.css'


function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState(pokemon);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);


  const lastElementRef = useRef(null);

  useEffect(() => {
    const getPokemon = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${page * 20}`);
      const {results} = await res.json();
      setPokemon((prevPokes) => [...prevPokes, ...results]);
    }
    getPokemon(page, setPokemon, pokemon);


  }, [page])

  const callbackfunction = (entries) => {
    const [entry] = entries;
    console.log(entry)
    if (entry.isIntersecting) setPage((page) => page + 1);
  }

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.8,
  }

  useEffect(() => {
    const observer = new IntersectionObserver(callbackfunction, options)
    if (lastElementRef.current) observer.observe(lastElementRef.current);

    return () => {
      if (lastElementRef.current) observer.unobserve(lastElementRef.current);
    }
  }, [lastElementRef])

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        setFilteredPokemon(pokemon.filter(({ name }) => name.includes(search)));
        setSelected(null);
      }
      , 200)

    return () => clearTimeout(timeoutId);
  }, [search, pokemon])

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleSelect = (id) => {
    const url = pokemon[id].url;
    const fetchPokemon = async () => {
      const res = await fetch(url);
      const json = await res.json();
      setSelected(json.height);
    }

    fetchPokemon();
  }

  console.log(pokemon);
  return (
    <>
      <input onChange={handleSearch} value={search}></input>
      <ul>
        {filteredPokemon.map(({ name, url }, id) => <PokemonTile key={id} name={name} url={url}/>)}
        <div ref={lastElementRef}></div>
      </ul>
      {/* <button onClick={() => setPage((page) => page + 1)}>load more</button> */}
      {selected && <div>height is: {selected}</div>}
    </>
  )
}

export default App
