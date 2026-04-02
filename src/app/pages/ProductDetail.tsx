import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getProductById, addToCart, initializeMockData } from "../utils/dataManager";
import { ShoppingCart, Heart, Share2, QrCode, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initializeMockData();
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (id) {
      const fetchProduct = async () => {
        try {
          const productData = await getProductById(id);
          if (productData) {
            setProduct(productData);
          }
        } catch (err) {
          console.error("Failed to fetch product:", err);
        }
      };
      
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (user.role === "seller") {
      toast.error("Sellers cannot purchase products");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    
    toast.success(`Added ${quantity} item(s) to cart`);
    // Trigger a page reload to update cart count
    window.dispatchEvent(new Event("storage"));
  };

  const traceUrl = `${window.location.origin}/trace/${id}`;

  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-amber-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Product QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center py-6">
                    <QRCodeSVG value={traceUrl} size={256} />
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      Scan to trace this product's origin and artisan story
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
              {product.category}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-amber-600 mb-6">₹{product.price}</div>
            
            <p className="text-gray-700 text-lg mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6 mb-4"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {/* Product Details */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Product Details</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Handcrafted with traditional techniques</li>
                  <li>• Made with natural, eco-friendly materials</li>
                  <li>• Each piece is unique with slight variations</li>
                  <li>• Supports rural artisan communities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Artisan Story Section */}
        <Card className="mb-12 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Meet the Artisan</h2>
                <p className="text-gray-600">The story behind your product</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Artisan Name</p>
                  <p className="text-gray-700">{product.artisanName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-700">{product.artisanLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Craft Tradition</p>
                  <p className="text-gray-700">{product.category}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-amber-200 pt-6">
              <h3 className="font-semibold text-lg mb-3">The Story</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{product.story}</p>
              <h3 className="font-semibold text-lg mb-3">Craft Process</h3>
              <p className="text-gray-700 leading-relaxed">{product.craftProcess}</p>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-600" />
                Scan the QR code to view this artisan story on your mobile device
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trace Button */}
        <div className="text-center">
          <Link to={`/trace/${product.id}`}>
            <Button variant="outline" size="lg" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50">
              <QrCode className="w-5 h-5 mr-2" />
              View Full Product Trace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
