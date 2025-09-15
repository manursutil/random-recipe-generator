import axios from "axios";

const baseUrl = "http://localhost:3000/recipes";

const categoryList = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
const areaList = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";

const getRandomRecipe = async () => {
  const request = axios.get(`${baseUrl}/random`);
  const response = await request;
  return response.data;
};

const getRecipeById = async (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  const response = await request;
  return response.data;
};

const getCategoryList = async () => {
  const request = axios.get(categoryList);
  const response = await request;
  return response.data;
};

const getRecipeByCategory = async (category) => {
  const request = axios.get(`${baseUrl}/category/${category}`);
  const response = await request;
  return response.data;
};

const getAreaList = async () => {
  const request = axios.get(areaList);
  const response = await request;
  return response.data;
};

const getRecipeByArea = async (area) => {
  const request = axios.get(`${baseUrl}/area/${area}`);
  const response = await request;
  return response.data;
};

export default {
  getRandomRecipe,
  getRecipeById,
  getCategoryList,
  getRecipeByCategory,
  getAreaList,
  getRecipeByArea,
};
