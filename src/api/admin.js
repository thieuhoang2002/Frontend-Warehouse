import apiClient from "./api-client";

const BASE = "/api/admin";

// ── Users ──────────────────────────────────────────────────────────────────
export const getAllUsers = () =>
  apiClient.get(`${BASE}/users`).then((r) => r.data).catch(() => []);

export const createUser = (data) =>
  apiClient.post(`${BASE}/users`, data);

export const updateUser = (id, data) =>
  apiClient.put(`${BASE}/users/${id}`, data);

export const resetPassword = (id, password) =>
  apiClient.put(`${BASE}/users/${id}/reset-password`, { password });

export const deleteUser = (id) =>
  apiClient.delete(`${BASE}/users/${id}`);

// ── Warehouses ─────────────────────────────────────────────────────────────
export const getAllWarehouses = () =>
  apiClient.get(`${BASE}/warehouses`).then((r) => r.data).catch(() => []);

export const createWarehouse = (data) =>
  apiClient.post(`${BASE}/warehouses`, data);

export const updateWarehouse = (id, data) =>
  apiClient.put(`${BASE}/warehouses/${id}`, data);

export const deleteWarehouse = (id) =>
  apiClient.delete(`${BASE}/warehouses/${id}`);

// ── Shelves ────────────────────────────────────────────────────────────────
export const getAllShelves = () =>
  apiClient.get(`${BASE}/shelves`).then((r) => r.data).catch(() => []);

export const createShelf = (data) =>
  apiClient.post(`${BASE}/shelves`, data);

export const deleteShelf = (id) =>
  apiClient.delete(`${BASE}/shelves/${id}`);

// ── System Info ────────────────────────────────────────────────────────────
export const getSystemInfo = () =>
  apiClient.get(`${BASE}/system-info`).then((r) => r.data).catch(() => ({}));

export const resetDemoData = () =>
  apiClient.post(`${BASE}/reset-demo`);


