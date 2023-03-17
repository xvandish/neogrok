import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { NotFoundPage } from "./404-page";
import { Nav } from "./nav";
import { NotYetImplementedPage } from "./not-yet-implemented-page";
import { PreferencesProvider } from "./preferences";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <div className="container mx-auto px-2">
          <Nav />
          <main>
            <Outlet />
          </main>
        </div>
      }
    >
      <Route path="/" lazy={() => import("./search-page")} />
      <Route path="/about" lazy={() => import("./about-page")} />
      <Route path="/syntax" lazy={() => import("./query-syntax-page")} />
      <Route path="/repositories" lazy={() => import("./repositories-page")} />

      {/* livegrep compatability routes */}
      <Route path="/search/*" lazy={() => import("./livegrep-search")} />
      <Route path="/view/*" lazy={() => import("./livegrep-fileviewer-redirect-page")} />
      <Route path="/delve/*" lazy={() => import("./livegrep-fileviewer-redirect-page")} />
      <Route path="/experimental/*" lazy={() => import("./livegrep-fileviewer-redirect-page")} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export const App = () => (
  <PreferencesProvider>
    <RouterProvider router={router} />
  </PreferencesProvider>
);
