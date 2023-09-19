import './App.css';
// import configWebsite from './config_website.json'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Oke</h1>,
  },
]);

function App() {

  return (
      <div className="App">
        <RouterProvider router={router} />
      </div>
  );
}

export default App;
