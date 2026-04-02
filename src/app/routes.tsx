import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Subscription from "./pages/Subscription";
import ProductTrace from "./pages/ProductTrace";
import Impact from "./pages/Impact";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "user-dashboard", Component: UserDashboard },
      { path: "seller-dashboard", Component: SellerDashboard },
      { path: "products", Component: ProductListing },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "subscription", Component: Subscription },
      { path: "trace/:id", Component: ProductTrace },
      { path: "impact", Component: Impact },
      { path: "*", Component: NotFound },
    ],
  },
]);
