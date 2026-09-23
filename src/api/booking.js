import apiClient from "./api-client";

const API_PATH = "/api/booking/";

const upload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient
    .post(API_PATH + "upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.message)
    .catch((err) => err.response?.data?.message || "Upload thất bại");
};

const getAllBookings = () =>
  apiClient.get(API_PATH + "all")
    .then((r) => r.data)
    .catch(() => []);

const updateBooking = (booking) => {
  const formData = new FormData();
  formData.append("email", booking.customerEmail);
  formData.append("phoneNumber", booking.numberphone);
  formData.append("fullName", booking.customerName);
  formData.append("filePath", booking.excelFile);
  return apiClient
    .put(API_PATH + `update/${booking.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.message)
    .catch((err) => err.response?.data?.message || "Cập nhật thất bại");
};

const getTotalCustomers = () =>
  apiClient.get(API_PATH + "totalCustomers")
    .then((r) => r.data)
    .catch(() => 0);

const BookingService = {
  upload,
  getAllBookings,
  updateBooking,
  getTotalCustomers,
};

export default BookingService;
