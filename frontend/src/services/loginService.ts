import { API_URL } from "@/constants";

export const loginUser = async (
  username: string,
  password: string
): Promise<{ role: string; }> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: username, password }), // Send user credentials to backend
  });

  if (!response.ok) {
    throw new Error("Login failed"); // Handle errors such as invalid credentials
  }

  const { token, role } = await response.json(); // Extract the JWT token from the server's response
  localStorage.setItem("token", token); // Store the token for later use
  localStorage.setItem('role', role);
  localStorage.setItem('username', username);
  return { role };
};

export const getToken = (): string | null => {
  return localStorage.getItem("token"); // Retrieve the token from localStorage
};

export const getRole = (): string | null => {
  return localStorage.getItem("role"); // Retrieve the token from localStorage
};

export const getUserName = (): string | null => {
  return localStorage.getItem("username"); // Retrieve the token from localStorage
};


export const logoutUser = (): void => {
  localStorage.removeItem("token"); // Remove the token from storage to log out the user
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  window.location.replace('/login');
};