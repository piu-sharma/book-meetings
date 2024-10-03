const isDev = process.env.NODE_ENV === "development";
const API_URL = isDev ? process.env.API_SERVER : ''; // Replace with your actual API URL

const Roles = {
  user: 'user',
  admin: 'admin',
};

export {
  API_URL,
  Roles,
};