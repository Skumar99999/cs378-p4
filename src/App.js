import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const App = () => {
// variables for storing Pokémon data, user input, error message, and button list
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonName, setPokemonName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pokemonButtons, setPokemonButtons] = useState(['pikachu', 'charmander', 'bulbasaur']);

  useEffect(() => {
    // default Pokémon
    fetchPokemonData('pikachu');
  }, []);

  // Function to fetch Pokémon data from the API
  const fetchPokemonData = async (name) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      setPokemonData(response.data);
      setErrorMessage('');
      if (!pokemonButtons.includes(name.toLowerCase())) {
        setPokemonButtons([...pokemonButtons, name.toLowerCase()]);
      }
    } catch (error) {
      setPokemonData(null);
      setErrorMessage('Pokémon not found!');
    }
  };

  // Function to handle button click for Pokémon data
  const handleButtonClick = (name) => {
    setPokemonName(name);
    fetchPokemonData(name);
  };

  // Function to handle input change
  const handleInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  // Function to handle add button click
  const handleAddButtonClick = async () => {
    if (pokemonName.trim() !== '' && !pokemonButtons.includes(pokemonName.toLowerCase())) {
      const newName = pokemonName.toLowerCase();
      try {
        await fetchPokemonData(newName);
        // clear the input field after adding
        setPokemonName('');
      } catch (error) {
        // error if not found
        setErrorMessage('Pokémon not found!');
      }
    }
  };

  // Prepare data for chart
  const numericDataPoints = pokemonData ? [
    { label: 'Height', value: pokemonData.height },
    { label: 'Weight', value: pokemonData.weight },
    { label: 'Base Experience', value: pokemonData.base_experience },
    ...pokemonData.stats.map((stat) => ({ 
        label: stat.stat.name, 
        value: stat.base_stat }))
  ] : [];

  // chart data and look handling
  const data = {
    labels: numericDataPoints.map((dataPoint) => dataPoint.label),
    datasets: [{
      label: pokemonData ? pokemonData.name : '',
      data: numericDataPoints.map((dataPoint) => dataPoint.value),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
    }]
  };

  return (
    <div>
      <h1>Pokémon Information</h1>
      {/* Input field for Pokémon name */}
      <input type="text" value={pokemonName} onChange={handleInputChange} />
      {/* Add button */}
      <button onClick={handleAddButtonClick}>Add</button>
      {/* Pokémon buttons */}
      {pokemonButtons.map((name) => (
        <button key={name} onClick={() => handleButtonClick(name)}>{name}</button>
      ))}

      {/* Display error message if Pokémon not found */}
      {errorMessage && <p>{errorMessage}</p>}

        {/* Display Pokémon info */}
      {pokemonData && (
        <div>
          <h2>{pokemonData.name}</h2>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
          <div style={{ maxWidth: '300px' }}>
            <Radar data={data} />
          </div>
          <div>
            <p>Type:</p>
            <ul>
              {pokemonData.types.map((type, index) => (
                <li key={index}>{type.type.name}</li>
              ))}
            </ul>
            <p>Abilities:</p>
            <ul>
              {pokemonData.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
            <p>Height: {pokemonData.height}</p>
            <p>Weight: {pokemonData.weight}</p>
            <p>Base Experience: {pokemonData.base_experience}</p>
            <p>Stats:</p>
            <ul>
              {pokemonData.stats.map((stat) => (
                <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;