import { createContext } from "react";

const UserContext = createContext()

export default UserContext


// if you use user context add this 

// import { useContext } from "react";
// import this file also
// const { loggedInUser, setLoggedInUser } = useContext(UserContext);

// useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     setLoggedInUser(JSON.parse(storedUser));
//   }, []);