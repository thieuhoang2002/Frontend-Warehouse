import apiClient from "./api-client";

const API_PATH = "/api/product/";

const getAllProducts = () =>
  apiClient.get(API_PATH + "all")
    .then((r) => r.data)
    .catch(() => []);

const getListProducts = () =>
  apiClient.get(API_PATH + "get-list-products")
    .then((r) => r.data)
    .catch(() => []);

const getProductsIsNullCompartment = () =>
  apiClient.get(API_PATH + "items-not-in-compartments")
    .then((r) => r.data)
    .catch(() => []);

const getProductsByCheckinDecrease = () =>
  apiClient.get(API_PATH + "items-check-in-decrease")
    .then((r) => r.data)
    .catch(() => []);

const getProductsByCheckinIncrease = () =>
  apiClient.get(API_PATH + "items-check-in-increase")
    .then((r) => r.data)
    .catch(() => []);

const getProductsByCheckoutIncrease = () =>
  apiClient.get(API_PATH + "items-check-out-increase")
    .then((r) => r.data)
    .catch(() => []);

const getProductsByCheckoutDecrease = () =>
  apiClient.get(API_PATH + "items-check-out-decrease")
    .then((r) => r.data)
    .catch(() => []);

const searchItem = (data) =>
  apiClient.get(API_PATH + "search", { params: { data } })
    .then((r) => r.data)
    .catch(() => []);

const updateProduct = (product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("quantity", product.quantity);
  formData.append("status", product.status);
  formData.append("checkin", product.checkin);
  formData.append("checkout", product.checkout);
  formData.append("delivery", product.delivery);
  formData.append("weight", product.weight);

  return apiClient
    .put(API_PATH + `update/${product.itemId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.message)
    .catch((err) => err.response?.data?.message || "Cập nhật thất bại");
};

const getTotalItemsInStock = () =>
  apiClient.get(API_PATH + "totalItemsInStock")
    .then((r) => r.data)
    .catch(() => 0);

const getMonthlyItemCount = () =>
  apiClient.get(API_PATH + "monthlyItemCount")
    .then((r) => Array.isArray(r.data) ? r.data : [])
    .catch(() => []);

const ProductService = {
  getAllProducts,
  updateProduct,
  searchItem,
  getProductsIsNullCompartment,
  getProductsByCheckinDecrease,
  getProductsByCheckinIncrease,
  getProductsByCheckoutDecrease,
  getProductsByCheckoutIncrease,
  getListProducts,
  getTotalItemsInStock,
  getMonthlyItemCount,
};

export default ProductService;
