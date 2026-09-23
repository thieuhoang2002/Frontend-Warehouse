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

// ── System Info ────────────────────────────────────────────────────────────
export const getSystemInfo = () =>
  apiClient.get(`${BASE}/system-info`).then((r) => r.data).catch(() => ({}));
