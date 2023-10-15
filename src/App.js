import "./assets/css/App.css";
// import configWebsite from './config_website.json'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import { useEffect } from "react";
import { getMessagingToken, onMessageListener } from "./configs/firebase";
import user_axios from "./user_axios";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  useEffect(() => {
    document.title = "FPsy - School Psychology 4F";
  }, []);

  useEffect(() => {
    const getCurrentToken = async () => {
      const currToken = await getMessagingToken();
      if (currToken) {
        user_axios
          .post("user/fcm_token", {
            fcmToken: currToken,
          })
          .then((res) => console.log(res))
          .catch((error) => console.log(error));
      }
    };
    getCurrentToken();
  }, []);
  useEffect(() => {
    onMessageListener().then((data) => {
      console.log("Receive foreground: ", data);
    });
  });

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
