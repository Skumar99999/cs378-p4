import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonName, setPokemonName] = useState('pikachu'); // Default Pokémon

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      setPokemonData(response.data);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  const handleButtonClick = (name) => {
    setPokemonName(name);
    fetchPokemonData();
  };

  const handleInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  return (
    <div>
      <h1>Pokémon Information</h1>
      <input type="text" value={pokemonName} onChange={handleInputChange} />
      <button onClick={() => handleButtonClick('pikachu')}>Pikachu</button>
      <button onClick={() => handleButtonClick('charmander')}>Charmander</button>
      <button onClick={() => handleButtonClick('bulbasaur')}>Bulbasaur</button>

      {pokemonData && (
        <div>
          <h2>{pokemonData.name}</h2>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
          <p>Type: {pokemonData.types[0].type.name}</p>
          <p>Abilities: {pokemonData.abilities.map((ability) => ability.ability.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default App;