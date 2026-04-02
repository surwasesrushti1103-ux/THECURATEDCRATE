import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { getCart, getProductById, addOrder, clearCart } from "../utils/dataManager";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../utils/supabaseClient";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const loadCartProducts = async () => {
      try {
        const cart = getCart();
        const itemsWithDetails = await Promise.all(
          cart.map(async (item: any) => {
            const product = await getProductById(item.productId);
            return {
              ...item,
              product,
            };
          })
        );
        setCartItems(itemsWithDetails.filter(item => item.product != null));
      } catch (e) {
        toast.error("Failed to load cart products.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartProducts();

    // Load Razorpay script
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [navigate]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Please check your connection or disable ad-blockers.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order in our Database (status pending)
      const orderData = {
        userId: user.id,
        items: cartItems,
        subtotal,
        shipping,
        total,
        paymentId: null,
        status: "pending",
        shippingAddress: formData,
      };
      
      const savedOrder = await addOrder(orderData);

      // 2. Call Edge Function to create Razorpay Order
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
      const endpoint = SUPABASE_URL 
        ? `${SUPABASE_URL}/functions/v1/server/create-order`
        : "/functions/v1/server/create-order"; // Fallback
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          userId: user.id,
          orderId: savedOrder.id,
          notes: {
            app: "Curated Crate"
          }
        })
      });

      const rpData = await response.json();
      if (!response.ok || !rpData.success) {
        throw new Error(rpData.error || "Failed to create Razorpay order");
      }

      // 3. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demo", 
        amount: rpData.order.amount,
        currency: rpData.order.currency,
        name: "Curated Crate",
        description: "Handcrafted Products Checkout",
        image: "/logo.png",
        order_id: rpData.order.id, 
        handler: async function (paymentResponse: any) {
          try {
            // 4. Verify Payment
            const verifyReq = await fetch(SUPABASE_URL 
              ? `${SUPABASE_URL}/functions/v1/server/verify-payment`
              : "/functions/v1/server/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                userId: user.id,
                orderId: savedOrder.id
              })
            });
            
            const verifyData = await verifyReq.json();
            
            if (verifyReq.ok && verifyData.success) {
              clearCart();
              setShowSuccess(true);
              window.dispatchEvent(new Event("storage"));
              setTimeout(() => {
                navigate("/user-dashboard");
              }, 3000);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Error verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: formData.phone,
        },
        theme: {
          color: "#d97706",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });
      razorpay.open();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initiate checkout.");
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for supporting our artisans. Your order has been confirmed.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Button onClick={() => navigate("/products")} className="bg-amber-600 hover:bg-amber-700">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="House/Flat No., Street, Locality"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        required
                        pattern="[0-9]{6}"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₹{total} with Razorpay
                    </Button>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">₹{shipping}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-amber-600">₹{total}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    By completing this purchase, you're directly supporting {cartItems.length} artisan
                    {cartItems.length > 1 ? "s" : ""} and their families.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
