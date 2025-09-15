import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
});

// Recipes
export const getRandomRecipe = async () => {
  const { data } = await api.get("/recipes/random");
  return data;
};

export const getRecipeById = async (id) => {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
};

export const getRecipeByCategory = async (category) => {
  const { data } = await api.get(`/recipes/category/${category}`);
  return data;
};

export const getRecipeByArea = async (area) => {
  const { data } = await api.get(`/recipes/area/${area}`);
  return data;
};

// Third-party endpoints for performance in frontend components
export const getCategoryList = async () => {
  const { data } = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  return data;
};

export const getAreaList = async () => {
  const { data } = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  return data;
};

// Auth
export const signup = async (email, password) => {
  const { data } = await api.post("/auth/signup", { email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const me = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

// Saved Recipes (DB-backed)
export const addSavedRecipe = async (recipeId) => {
  const { data } = await api.post("/auth/saved-recipes", { recipeId });
  return data;
};

export const listSavedRecipes = async () => {
  const { data } = await api.get("/auth/saved-recipes");
  return data;
};

export const deleteSavedRecipe = async (id) => {
  const { data } = await api.delete(`/auth/saved-recipes/${id}`);
  return data;
};

const apiClient = {
  // Recipes
  getRandomRecipe,
  getRecipeById,
  getRecipeByCategory,
  getRecipeByArea,
  // Third-party lists
  getCategoryList,
  getAreaList,
  // Auth
  signup,
  login,
  logout,
  me,
  // Saved Recipes
  addSavedRecipe,
  listSavedRecipes,
  deleteSavedRecipe,
};

export default apiClient;
