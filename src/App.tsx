import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/login";
import Home from "./pages/home";
import Wrapper from "./components/wrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Wrapper>
        <Home />
      </Wrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <Wrapper>
        <Login />
      </Wrapper>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
