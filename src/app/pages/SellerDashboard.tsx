import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { getSellerProducts, getSellerOrders, addProduct, initializeMockData } from "../utils/dataManager";
import { Plus, Package, TrendingUp, ShoppingBag, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    story: "",
    artisanName: "",
    artisanLocation: "",
    craftProcess: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    initializeMockData();
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "seller") {
      navigate("/user-dashboard");
      return;
    }

    setUser(parsedUser);
    loadData(parsedUser.id);
  }, [navigate]);

  const loadData = async (sellerId: string) => {
    try {
      const sellerProducts = await getSellerProducts(sellerId);
      setProducts(sellerProducts || []);
      
      const sellerOrders = await getSellerOrders(sellerId);
      setOrders(sellerOrders || []);
    } catch (error) {
      console.error("Error loading seller data:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.image) {
      toast.error("Please upload a product image");
      return;
    }

    const newProduct = {
      ...productForm,
      price: parseFloat(productForm.price),
      sellerId: user.id, // dataManager overrides this as seller_id anyway
    };

    try {
      await addProduct(newProduct);
      toast.success("Product added successfully!");
      
      // Reset form
      setProductForm({
        name: "",
        price: "",
        description: "",
        story: "",
        artisanName: "",
        artisanLocation: "",
        craftProcess: "",
        category: "",
        image: "",
      });
      
      setIsAddingProduct(false);
      await loadData(user.id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add product");
    }
  };

  if (!user) {
    return null;
  }

  const totalEarnings = orders.reduce((sum, order) => {
    const orderTotal = (order.items || order.order_items || [])
      .filter((item: any) => products.some((p) => p.id === (item.productId || item.product_id)))
      .reduce((itemSum: number, item: any) => itemSum + ((item.product || item.products)?.price || 0) * item.quantity, 0);
    return sum + orderTotal;
  }, 0);

  const totalProducts = products.length;
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home Decor">Home Decor</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Textiles">Textiles</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Pottery">Pottery</SelectItem>
                      <SelectItem value="Wood Craft">Wood Craft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description *</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story">Artisan Story *</Label>
                  <Textarea
                    id="story"
                    placeholder="Tell the story behind this product and the artisan who made it..."
                    value={productForm.story}
                    onChange={(e) => setProductForm({ ...productForm, story: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="artisanName">Artisan Name *</Label>
                    <Input
                      id="artisanName"
                      value={productForm.artisanName}
                      onChange={(e) => setProductForm({ ...productForm, artisanName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artisanLocation">Location *</Label>
                    <Input
                      id="artisanLocation"
                      placeholder="City, State"
                      value={productForm.artisanLocation}
                      onChange={(e) => setProductForm({ ...productForm, artisanLocation: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="craftProcess">Craft Process *</Label>
                  <Textarea
                    id="craftProcess"
                    placeholder="Describe the traditional craft process used..."
                    value={productForm.craftProcess}
                    onChange={(e) => setProductForm({ ...productForm, craftProcess: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required={!productForm.image}
                  />
                  {productForm.image && (
                    <img src={productForm.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                    Add Product
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <Package className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <ShoppingBag className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalEarnings}</p>
                </div>
                <IndianRupee className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products and Orders */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders Received</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't added any products yet</p>
                  <Button
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id}>
                    <div className="relative h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-amber-600">
                        ₹{product.price}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-xs text-gray-500">{product.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No orders received yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(order.items || order.order_items || [])
                        .filter((item: any) => products.some((p) => p.id === (item.productId || item.product_id)))
                        .map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">
                              {(item.product || item.products)?.name} × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              ₹{((item.product || item.products)?.price || 0) * item.quantity}
                            </span>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
