import React from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import HomePage from './pages/home';
import  { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

function App() {
 
 const [postsPerPage] = useState(10);
 const [offset, setOffset] = useState(1);
 const [posts, setAllPosts] = useState([]);
 const [pageCount, setPageCount] = useState(0)
 
const getPostData = (data) => {
   return (
     data.map(pokemon => 
	 <div className="container" key={pokemon.name}>
	{pokemon.name}
     </div>)
	
   )
 }
 
 const getAllPosts = async () => {
   const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=120`);
   const data = res.data;
   
   const pokemonNames=data.results;
   
   const slice = pokemonNames.slice(offset - 1 , offset - 1 + postsPerPage)
   
  console.log(JSON.stringify(slice));
  console.log(JSON.stringify(offset));
  console.log(JSON.stringify(postsPerPage));
 
   
   
   // For displaying Data
   const postData = getPostData(slice);
 
   // Using Hooks to set value
   setAllPosts(postData);
   setPageCount(Math.ceil(pokemonNames.length / postsPerPage));
   
    console.log(JSON.stringify(Math.ceil(pokemonNames.length / postsPerPage)));
 }
 
 const handlePageClick = (event) => {
   const selectedPage = event.selected;
   setOffset(selectedPage + 1)
 };
 
 useEffect(() => {
   getAllPosts()
 }, [offset])
 
 return (
 
   <div className="main-app">
   <HomePage />
     {/* Display all the pokemons */}
	 
	 {posts}
     {/* Using React Paginate */}
     <ReactPaginate
       previousLabel={"previous"}
       nextLabel={"next"}
       breakLabel={"..."}
       breakClassName={"break-me"}
       pageCount={pageCount}
       onPageChange={handlePageClick}
       containerClassName={"pagination"}
       subContainerClassName={"pages pagination"}
       activeClassName={"active"} />
   </div>
 );
 
 
}


function renderEverything(){
    let allPokemonContainer = document.querySelector('#poke-container')
    allPokemonContainer.innerText = "";
    fetchPokemon();
}

function fetchPokemon(){
	fetch('https://pokeapi.co/api/v2/pokemon?limit=120')
    .then(response => response.json())
    .then(function(allpokemon){
        allpokemon.results.forEach(function(pokemon){
            fetchPokemonData(pokemon);
        })
    })
	
	
}


function fetchPokemonData(pokemon){
    let url = pokemon.url // <--- this is saving the pokemon url to a variable to use in the fetch. 
                                //Example: https://pokeapi.co/api/v2/pokemon/1/"
    fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
	
        renderPokemon(pokeData)
    
	
	})
}


function renderPokemon(pokeData){
	
    let allPokemonContainer = document.getElementById('poke-container');
	
	
    let pokeContainer = document.createElement("div"); //div will be used to hold the data/details for indiviual pokemon.{}
    pokeContainer.classList.add('ui', 'card');

    createPokeImage(pokeData.id, pokeContainer);

    let pokeName = document.createElement('h4') 
    pokeName.innerText = pokeData.name

    let pokeNumber = document.createElement('p')
    pokeNumber.innerText = `#${pokeData.id}`
   
    let pokeTypes = document.createElement('ul') //ul list will hold the pokemon types
  

    createTypes(pokeData.types, pokeTypes) // helper function to go through the types array and create li tags for each one

    pokeContainer.append(pokeName, pokeNumber, pokeTypes);   //appending all details to the pokeContainer div
    allPokemonContainer.appendChild(pokeContainer);       //appending that pokeContainer div to the main div which will hold all the pokemon cards
	
	
}

function createTypes(types, ul){
    types.forEach(function(type){
        let typeLi = document.createElement('li');
        typeLi.innerText = type['type']['name'];
        ul.append(typeLi)
    })
}

function createPokeImage(pokeID, containerDiv){
    let pokeImgContainer = document.createElement('div')
    pokeImgContainer.classList.add('image')

    let pokeImage = document.createElement('img')
    pokeImage.srcset = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeID}.png`
	

    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}

 
export default App;
