import axios from "axios";

const randomUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const baseUrl = "www.themealdb.com/api/json/v1/1/lookup.php";

const getRandomRecipe = () => {
  const request = axios.get(randomUrl);
  return request.then((response) => response.data);
};

const getRecipeById = (id) => {
  const request = axios.get(`${baseUrl}?i=${id}`);
  return request.then((response) => response.data);
};

export default { getRandomRecipe, getRecipeById };
