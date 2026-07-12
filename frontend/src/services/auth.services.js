import api from "../api/axiosInstance";

export const signUpUser = async (data) => {
  try {
    const res = await api.post("/users/sign-up", data);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (data) => {
  const res = await api.post("/users/login", data);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const logoutUser = async () => {
  localStorage.removeItem("token");
  const res = await api.post("/users/logout");
  return res.data;
};

export const getUser = async () => {
  try {
    const res = await api.get("/users/getme");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch authenticated user:", error);
    return null;
  }
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUser = async (userId, data) => {
  try {
    const res = await api.put(`/users/${userId}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
