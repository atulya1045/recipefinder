import React, { useState } from 'react';
import './RecipeCarousel.css';

function RecipeCarousel({ recipes, onRecipeSelect }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= recipes.length - 5 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? recipes.length - 5 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const visibleRecipes = recipes.slice(currentSlide, currentSlide + 5);

  return (
    <div className="carousel-container">
      <button className="carousel-button prev" onClick={prevSlide}>&#10094;</button>
      <div className="carousel">
        <div className="carousel-inner">
          {visibleRecipes.map((recipe, index) => (
            <div key={recipe.idMeal} className="carousel-item" onClick={() => onRecipeSelect(recipe)}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <div className="carousel-caption">{recipe.strMeal}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-button next" onClick={nextSlide}>&#10095;</button>

      {/* Indicators (dots) */}
      <div className="carousel-indicators">
        {recipes.map((recipe, index) => (
          <span
            key={recipe.idMeal}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        )).slice(0, Math.ceil(recipes.length / 5))}
      </div>
    </div>
  );
}

export default RecipeCarousel;
