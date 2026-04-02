import { Outlet, useLocation, Link } from "react-router";
import { ShoppingBag, User, Menu, X, Heart, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";

export default function Root() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Update cart count
    updateCartCount();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);
  
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const validCart = cart.filter((item: any) => item && item.productId);
      setCartCount(validCart.length);
      // clean corrupted count
      localStorage.setItem("cartCount", validCart.length.toString());
    } catch {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartCount");
    setUser(null);
    window.location.href = "/";
  };

  // Don't show header on login/register pages
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-amber-50">
      {!hideHeader && (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <ShoppingBag className="w-8 h-8 text-amber-600" />
                <span className="text-xl font-bold text-amber-900">Curated Crate</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/products" className="text-gray-700 hover:text-amber-600 transition">
                  Products
                </Link>
                <Link to="/subscription" className="text-gray-700 hover:text-amber-600 transition">
                  Subscriptions
                </Link>
                <Link to="/impact" className="text-gray-700 hover:text-amber-600 transition flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Impact
                </Link>
                {user ? (
                  <>
                    <Link
                      to={user.role === "seller" ? "/seller-dashboard" : "/user-dashboard"}
                      className="text-gray-700 hover:text-amber-600 transition"
                    >
                      Dashboard
                    </Link>
                    <Link to="/cart" className="relative">
                      <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-amber-600" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 space-y-3">
                <Link
                  to="/products"
                  className="block text-gray-700 hover:text-amber-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/subscription"
                  className="block text-gray-700 hover:text-amber-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Subscriptions
                </Link>
                <Link
                  to="/impact"
                  className="block text-gray-700 hover:text-amber-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Impact
                </Link>
                {user ? (
                  <>
                    <Link
                      to={user.role === "seller" ? "/seller-dashboard" : "/user-dashboard"}
                      className="block text-gray-700 hover:text-amber-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/cart"
                      className="block text-gray-700 hover:text-amber-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart ({cartCount})
                    </Link>
                    <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </header>
      )}
      <main>
        <Outlet />
      </main>
      {!hideHeader && (
        <footer className="bg-amber-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Curated Crate</h3>
                <p className="text-amber-200 text-sm">
                  Connecting rural artisans with urban customers, preserving India's rich handicraft heritage.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/products" className="text-amber-200 hover:text-white">Products</Link></li>
                  <li><Link to="/subscription" className="text-amber-200 hover:text-white">Subscriptions</Link></li>
                  <li><Link to="/impact" className="text-amber-200 hover:text-white">Our Impact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Artisans</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/register" className="text-amber-200 hover:text-white">Become a Seller</Link></li>
                  <li><Link to="/seller-dashboard" className="text-amber-200 hover:text-white">Seller Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-amber-200 text-sm">surwasesrushti1103@gmail.com</p>
                <p className="text-amber-200 text-sm mt-2">885093348</p>
              </div>
            </div>
            <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-200">
              © 2026 Curated Crate. Empowering artisans across India.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}