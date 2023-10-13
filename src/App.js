import './assets/css/App.css';
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
      element: <Auth />
   },
   {
      path: '*',
      element: <Navigate to='/' replace />
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
