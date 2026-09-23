import apiClient from "./api-client";

const API_PATH = "/api/compartments";

const parseItemId = (itemId) => {
  if (itemId.startsWith("SP")) {
    return parseInt(itemId.substring(2), 10);
  }
  throw new Error("Invalid formatted ID: " + itemId);
};

const addItemToCompartment = (compartmentId, itemId, quantity) => {
  try {
    const parsedItemId = parseItemId(itemId);
    return apiClient.post(`${API_PATH}/${compartmentId}/addItem`, {
      itemId: parsedItemId,
      quantity,
    });
  } catch (error) {
    console.error(error.message);
    return Promise.reject(new Error("Invalid item ID format."));
  }
};

const updateItemQuantity = (compartmentId, itemId, quantity) =>
  apiClient.put(`${API_PATH}/${compartmentId}/updateQuantity`, {
    itemId,
    quantity,
  });

const deleteItemFromCompartment = (compartmentId, itemId) =>
  apiClient.delete(`${API_PATH}/${compartmentId}/removeItem/${itemId}`);

const checkoutItem = (compartmentId, itemId, referenceNo, delivery) =>
  apiClient.post(
    `${API_PATH}/${compartmentId}/checkout/${itemId}`,
    null,
    { params: { referenceNo, delivery } }
  );

// Note: no double-slash — API_PATH does NOT have trailing slash
const getPendingCheckoutItems = () =>
  apiClient.get(`${API_PATH}/checkout/pending`);

const confirmCheckout = (recordId) =>
  apiClient.post(`${API_PATH}/checkout/confirm/${recordId}`);

const cancelCheckout = (recordId) =>
  apiClient.post(`${API_PATH}/checkout/cancel/${recordId}`);

const CompartmentService = {
  addItemToCompartment,
  updateItemQuantity,
  deleteItemFromCompartment,
  checkoutItem,
  getPendingCheckoutItems,
  confirmCheckout,
  cancelCheckout,
};

export default CompartmentService;
