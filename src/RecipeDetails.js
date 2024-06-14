import React, { useEffect, useState } from 'react';
import './RecipeDetails.css';

function RecipeDetails({ recipe, onBack, isFavorite, onAddToFavorites, onRemoveFromFavorites }) {
  const [recipeDetails, setRecipeDetails] = useState(null);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`)
      .then(response => response.json())
      .then(data => {
        if (data.meals && data.meals.length > 0) {
          setRecipeDetails(data.meals[0]);
        } else {
          console.error('Recipe details not found.');
        }
      })
      .catch(error => {
        console.error('Error fetching recipe details:', error);
      });
  }, [recipe.idMeal]);

  const handleAddToFavorites = () => {
    onAddToFavorites(recipe);
  };

  const handleRemoveFromFavorites = () => {
    onRemoveFromFavorites(recipe.idMeal);
  };

  if (!recipeDetails) {
    return null; // or loading indicator
  }

  return (
    <div className="recipe-details">
      <button className="back-button" onClick={onBack}>Back to Recipes</button>
      <div className="recipe-details-content">
        <h2 className="recipe-title">{recipeDetails.strMeal}</h2>
        <img src={recipeDetails.strMealThumb} alt={recipeDetails.strMeal} className="recipe-image" />
        <div className="recipe-section">
          <h3 className="section-title">Ingredients:</h3>
          <ul className="ingredient-list">
            {getIngredients(recipeDetails).map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="recipe-section">
          <h3 className="section-title">Instructions:</h3>
          <p className="recipe-instructions">{recipeDetails.strInstructions}</p>
        </div>
        <button
          className={`favorite-button ${isFavorite ? 'remove' : 'add'}`}
          onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}

function getIngredients(recipe) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  return ingredients;
}

export default RecipeDetails;
