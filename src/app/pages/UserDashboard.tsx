import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getUserOrders, getUserSubscriptions } from "../utils/dataManager";
import { Package, ShoppingBag, Calendar, Heart, TrendingUp } from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "user") {
      navigate("/seller-dashboard");
      return;
    }

    setUser(parsedUser);

    const loadData = async () => {
      try {
        const userOrders = await getUserOrders(parsedUser.id);
        setOrders(userOrders || []);
        
        const userSubs = await getUserSubscriptions(parsedUser.id);
        setSubscriptions(userSubs || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [navigate]);

  if (!user) {
    return null;
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your orders and subscriptions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalSpent}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-gray-900">{subscriptions.length}</p>
                </div>
                <Package className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/products">
            <Button className="w-full bg-amber-600 hover:bg-amber-700">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </Link>
          <Link to="/subscription">
            <Button variant="outline" className="w-full">
              <Package className="w-4 h-4 mr-2" />
              Subscribe to Box
            </Button>
          </Link>
          <Link to="/impact">
            <Button variant="outline" className="w-full">
              <Heart className="w-4 h-4 mr-2" />
              View Impact
            </Button>
          </Link>
        </div>

        {/* Orders and Subscriptions */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                  <Link to="/products">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Start Shopping
                    </Button>
                  </Link>
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
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {(order.items || order.order_items || []).map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {(item.product || item.products)?.name} × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              ₹{((item.product || item.products)?.price || 0) * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-bold">Total</span>
                        <span className="text-lg font-bold text-amber-600">₹{order.total}</span>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        <p>Payment ID: {order.paymentId}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6">
            {subscriptions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You don't have any active subscriptions</p>
                  <Link to="/subscription">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Subscribe Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <Card key={sub.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{sub.plan} Subscription</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            Started on {new Date(sub.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Monthly delivery on the 15th</span>
                      </div>
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
