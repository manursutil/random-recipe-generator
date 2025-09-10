import axios from "axios";

const baseUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

const getRandomRecipe = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

export default { getRandomRecipe };
