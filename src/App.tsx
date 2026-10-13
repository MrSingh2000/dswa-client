import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/login";
import Layout from "./components/layout";
import AuthenticatedRoute from "./components/authenticated-route";
import AllProblems from "./pages/all-problems";
import Chapters from "./pages/chapters";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <AllProblems />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/chapters",
    element: (
      <AuthenticatedRoute>
        <Chapters />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}

export default App;
