import React, { useState, useEffect } from 'react';
import RecipeDetails from './RecipeDetails';
import RecipeCarousel from './RecipeCarousel';
import './RecipeFinder.css';

function RecipeFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState('');
  const [recipesLoaded, setRecipesLoaded] = useState(false);

  const fetchRecipes = async () => {
    const endpoints = [
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican',
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian',
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese',
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Japanese',
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=American',
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian',
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=French',
    ];

    const promises = endpoints.map(endpoint => fetch(endpoint).then(res => res.json()));
    const results = await Promise.all(promises);
    const allRecipes = results.flatMap(result => result.meals);
    setSearchResults(allRecipes);
    setRecipesLoaded(true);
  };

  useEffect(() => {
    fetchRecipes();
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          if (data.meals) {
            setSearchResults(data.meals);
          } else {
            setSearchResults([]);
          }
        })
        .catch(error => {
          console.error('Error fetching recipes:', error);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleCategory = (category) => {
    setCategory(category);
    let apiUrl = '';
    if (category === 'Vegetarian') {
      apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian';
    } else if (category === 'Non-Vegetarian') {
      apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken';
    }

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.meals) {
          setSearchResults(data.meals);
        } else {
          setSearchResults([]);
        }
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setSearchResults([]);
      });
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  const addToFavorites = (recipe) => {
    const updatedFavorites = [...favorites, recipe];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (recipeId) => {
    const updatedFavorites = favorites.filter(fav => fav.idMeal !== recipeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  };

  return (
    <div className="recipe-finder">
      <h1 className="page-title">Recipe Finder</h1>
      <div className="search-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      {recipesLoaded ? (
        <>
          <RecipeCarousel recipes={searchResults} onRecipeSelect={handleSelectRecipe} />
          <div className="categories">
            <button
              className={`category-button ${category === 'Vegetarian' ? 'selected' : ''}`}
              onClick={() => handleCategory('Vegetarian')}
            >
              Vegetarian
            </button>
            <button
              className={`category-button ${category === 'Non-Vegetarian' ? 'selected' : ''}`}
              onClick={() => handleCategory('Non-Vegetarian')}
            >
              Non-Vegetarian
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      {selectedRecipe ? (
        <RecipeDetails
          recipe={selectedRecipe}
          onBack={handleBack}
          onAddToFavorites={addToFavorites}
          onRemoveFromFavorites={removeFromFavorites}
          isFavorite={isFavorite(selectedRecipe.idMeal)}
        />
      ) : (
        <div className="recipe-list">
          {searchResults.map(recipe => (
            <div key={recipe.idMeal} className="recipe-card" onClick={() => handleSelectRecipe(recipe)}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
              <div className="recipe-name">{recipe.strMeal}</div>
              <button
                className="add-favorite-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFavorite(recipe.idMeal)) {
                    removeFromFavorites(recipe.idMeal);
                  } else {
                    addToFavorites(recipe);
                  }
                }}
              >
                {isFavorite(recipe.idMeal) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="favorites-section">
        <h2>Favorites</h2>
        <div className="favorites-list">
          {favorites.map(favorite => (
            <div key={favorite.idMeal} className="favorite-item">
              <img src={favorite.strMealThumb} alt={favorite.strMeal} className="favorite-image" />
              <div className="favorite-name">{favorite.strMeal}</div>
              <button
                className="remove-favorite-button"
                onClick={() => removeFromFavorites(favorite.idMeal)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeFinder;
