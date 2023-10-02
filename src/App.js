import './assets/css/App.css';
// import configWebsite from './config_website.json'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import {useEffect} from "react";

const router = createBrowserRouter([
      {
        path: "/",
        element: <Home />,
      },
    {
        path: "/auth",
        element: <Auth />
    }
]);

function App() {
        useEffect(() => {
            document.title = 'FPsy - School Psychology 4F';
        }, []);
      return (
          <div className="App">
            <RouterProvider router={router} />
          </div>
      );
}

export default App;
