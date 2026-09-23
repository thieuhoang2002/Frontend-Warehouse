import apiClient from "./api-client";

const API_PATH = "/api/shelf";

const getAllShelves = () =>
  apiClient.get(API_PATH)
    .then((r) => r.data)
    .catch(() => []);

const ShelfService = {
  getAllShelves,
};

export default ShelfService;
