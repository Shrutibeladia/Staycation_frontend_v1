import axios from "./axiosConfig";

export const auth = {
  login: (credentials) => axios.post("/auth/login", credentials),
  register: (payload) => axios.post("/auth/register", payload),
  // TODO: Backend has no logout endpoint yet — clear client state only.
};

export const users = {
  checkAuth: () => axios.get("/users/checkauthentication"),
  getProfile: (id) => axios.get(`/users/${id}`),
  updateProfile: (id, payload) => axios.put(`/users/${id}`, payload),
  deleteProfile: (id) => axios.delete(`/users/${id}`),
  listAll: (params) => axios.get("/users", { params }),
};

export const hotels = {
  list: (params) => axios.get("/hotels", { params }),
  get: (id) => axios.get(`/hotels/find/${id}`),
  getRooms: (hotelId) => axios.get(`/hotels/room/${hotelId}`),
  create: (payload) => axios.post("/hotels", payload),
  update: (id, payload) => axios.put(`/hotels/${id}`, payload),
  remove: (id) => axios.delete(`/hotels/${id}`),
  countByCity: (cities) =>
    axios.get("/hotels/countByCity", { params: { cities } }),
  countByType: () => axios.get("/hotels/countByType"),
};

export const rooms = {
  list: (params) => axios.get("/rooms", { params }),
  get: (id) => axios.get(`/rooms/${id}`),
  create: (hotelId, payload) => axios.post(`/rooms/${hotelId}`, payload),
  update: (id, payload) => axios.put(`/rooms/${id}`, payload),
  remove: (id, hotelId) => axios.delete(`/rooms/${id}/${hotelId}`),
  updateAvailability: (roomNumberId, dates) =>
    axios.put(`/rooms/availability/${roomNumberId}`, { dates }),
};

export const bookings = {
  create: (payload) => axios.post("/bookings", payload),
  getByUser: (id) => axios.get(`/bookings/user/${id}`),
  get: (id) => axios.get(`/bookings/${id}`),
  cancel: (id) => axios.put(`/bookings/${id}/cancel`),
};

// TODO: Payment endpoints are not production-ready — do not integrate Stripe until backend is ready.
// export const payments = { create, confirm };
