import './assets/css/App.css';
// import configWebsite from './config_website.json'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";

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

      return (
          <div className="App">
            <RouterProvider router={router} />
          </div>
      );
}

export default App;
