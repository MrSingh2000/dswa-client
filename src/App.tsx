import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/login";
import Layout from "./components/layout";
import AuthenticatedRoute from "./components/authenticated-route";
import AllProblems from "./pages/all-problems";
import Chapters from "./pages/chapters";
import Progress from "./pages/progress";
import Calendar from "./pages/calendar";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <AllProblems />
      </Layout>
    ),
  },
  {
    path: "/chapters",
    element: (
      <Layout>
        <Chapters />
      </Layout>
    ),
  },
  {
    path: "/progress",
    element: (
      <AuthenticatedRoute>
        <Layout>
          <Progress />
        </Layout>
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <AuthenticatedRoute>
        <Layout>
          <Calendar />
        </Layout>
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
