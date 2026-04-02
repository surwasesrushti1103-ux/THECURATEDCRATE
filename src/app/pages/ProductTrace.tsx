import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getProductById, initializeMockData } from "../utils/dataManager";
import { MapPin, User, Sparkles, ArrowLeft, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function ProductTrace() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    initializeMockData();
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

  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const traceUrl = `${window.location.origin}/trace/${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={`/product/${id}`}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 rounded-full mb-6">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Traceability</h1>
          <p className="text-lg text-gray-600">
            Discover the complete journey of your handcrafted product
          </p>
        </div>

        {/* QR Code */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-white p-6 rounded-lg shadow-inner">
                <QRCodeSVG value={traceUrl} size={200} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-3">Scan to Share</h2>
                <p className="text-gray-600 mb-4">
                  Share this QR code with others to let them discover the artisan story behind this product.
                  Each scan helps promote the artisan's craft and heritage.
                </p>
                <div className="inline-block bg-amber-50 px-4 py-2 rounded-lg">
                  <p className="text-sm font-mono text-gray-700">{traceUrl}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Info */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full md:w-48 h-48 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                  <span className="text-2xl font-bold text-amber-600">₹{product.price}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Steps */}
        <div className="space-y-6 mb-8">
          {/* Artisan */}
          <Card className="border-l-4 border-l-amber-600">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Meet the Artisan</h3>
                  <p className="text-lg font-semibold text-amber-600 mb-2">{product.artisanName}</p>
                  <p className="text-gray-700 leading-relaxed">{product.story}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Origin Location</h3>
                  <p className="text-lg font-semibold text-blue-600 mb-2">{product.artisanLocation}</p>
                  <p className="text-gray-700">
                    This product was handcrafted in {product.artisanLocation}, a region known for its rich 
                    heritage in traditional craftsmanship. The local artisan community has been preserving 
                    these techniques for generations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Craft Process */}
          <Card className="border-l-4 border-l-purple-600">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Traditional Craft Process</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{product.craftProcess}</p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-900">
                      <strong>Craft Type:</strong> {product.category}
                    </p>
                    <p className="text-sm text-purple-900 mt-2">
                      <strong>Technique:</strong> 100% Handmade using traditional methods
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Statement */}
        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
            <p className="text-lg mb-6 text-amber-50">
              By purchasing this product, you're directly supporting {product.artisanName} and their family,
              helping preserve traditional {product.category.toLowerCase()} crafts for future generations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-amber-50">Handmade</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-amber-50">Artisan Supported</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">Traditional</p>
                <p className="text-sm text-amber-50">Craft Preserved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link to={`/product/${id}`}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              View Product Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
