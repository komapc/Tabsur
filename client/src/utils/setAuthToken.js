import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Auth token set:", `Bearer ${token.substring(0, 20)}...`);
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
    console.log("Auth token removed");
  }
};

export default setAuthToken;
