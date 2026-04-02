import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { addSubscription } from "../utils/dataManager";
import { Check, Package, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Subscription() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load Razorpay script
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const plans = [
    {
      name: "Basic Box",
      price: 499,
      features: [
        "2-3 handcrafted items monthly",
        "Artisan story cards included",
        "Free shipping across India",
        "Cancel anytime",
        "Access to QR code tracing",
      ],
      popular: false,
    },
    {
      name: "Premium Box",
      price: 999,
      features: [
        "5-6 premium handcrafted items",
        "Detailed artisan video stories",
        "Priority free shipping",
        "Exclusive artisan access",
        "QR code tracing + certificates",
        "Surprise bonus items",
      ],
      popular: true,
    },
  ];

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (user.role === "seller") {
      toast.error("Sellers cannot subscribe to boxes");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Please check your connection or disable ad-blockers.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Call Edge Function to create Razorpay Order
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
      const endpoint = SUPABASE_URL 
        ? `${SUPABASE_URL}/functions/v1/make-server-74f38faf/create-order`
        : "/make-server-74f38faf/create-order"; // Fallback
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          currency: "INR",
          userId: user.id,
          // no orderId since this isn't a cart order
          notes: { plan: plan.name }
        })
      });

      const rpData = await response.json();
      if (!response.ok || !rpData.success) {
        throw new Error(rpData.error || "Failed to create Razorpay order");
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demo", 
        amount: rpData.order.amount,
        currency: rpData.order.currency,
        name: "Curated Crate",
        description: `${plan.name} Monthly Subscription`,
        image: "/logo.png",
        order_id: rpData.order.id, // The Razorpay Order ID
        handler: async function (paymentResponse: any) {
          try {
            // 3. Verify Payment
            const verifyReq = await fetch(SUPABASE_URL 
              ? `${SUPABASE_URL}/functions/v1/make-server-74f38faf/verify-payment`
              : "/make-server-74f38faf/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                userId: user.id
              })
            });
            
            const verifyData = await verifyReq.json();
            
            if (verifyReq.ok && verifyData.success) {
              // 4. Create Subscription in DB
              const subscription = {
                userId: user.id,
                planId: plan.name, // storing name as id
                amount: plan.price,
                interval: "monthly",
                status: "active",
              };

              await addSubscription(subscription);

              toast.success("Subscription activated successfully!");
              setTimeout(() => {
                navigate("/user-dashboard");
              }, 2000);
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
      toast.error(err.message || "Failed to initiate subscription payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-6">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Monthly Curated Handicraft Boxes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Receive authentic, handpicked artisan products delivered to your doorstep every month. 
            Each box tells a unique story of Indian craftsmanship.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-2 border-amber-600 shadow-xl" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-600 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-5xl font-bold text-amber-600 mb-2">
                  ₹{plan.price}
                  <span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-6 text-lg ${
                    plan.popular
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Subscribe",
                description: "Choose your preferred subscription plan",
              },
              {
                step: "2",
                title: "Curated Selection",
                description: "We handpick authentic handicrafts from verified artisans",
              },
              {
                step: "3",
                title: "Monthly Delivery",
                description: "Receive your box on the 15th of every month",
              },
              {
                step: "4",
                title: "Discover Stories",
                description: "Learn about artisans through QR codes and story cards",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full text-2xl font-bold text-amber-600 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's Inside */}
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-center mb-8">What's Inside Each Box?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gift,
                title: "Handcrafted Items",
                description: "Unique products from different craft traditions across India",
              },
              {
                icon: Package,
                title: "Story Cards",
                description: "Beautiful cards featuring the artisan's story and craft process",
              },
              {
                icon: Sparkles,
                title: "Surprise Elements",
                description: "Bonus items, discount vouchers, and exclusive artisan updates",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                  <item.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes! You can cancel your subscription at any time with no penalties. Your box will continue until the end of your paid period.",
              },
              {
                q: "When will I receive my first box?",
                a: "Your first box will be delivered on the 15th of the next month after subscription.",
              },
              {
                q: "Do you ship across India?",
                a: "Yes, we offer free shipping to all locations across India.",
              },
              {
                q: "Are the items different every month?",
                a: "Absolutely! We ensure variety by featuring different artisans and craft traditions each month.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
