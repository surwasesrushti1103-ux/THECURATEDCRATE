import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import Razorpay from "npm:razorpay";
import crypto from "node:crypto";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase Client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  );
};

// Initialize Razorpay
const getRazorpay = () => {
  return new Razorpay({
    key_id: Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_demo",
    key_secret: Deno.env.get("RAZORPAY_KEY_SECRET") || "secret",
  });
};

const handleCreateOrder = async (c: any) => {
  try {
    const { amount, currency = "INR", receipt, notes, userId, orderId } = await c.req.json();
    
    if (!amount) {
      return c.json({ error: "Amount is required" }, 400);
    }

    const instance = getRazorpay();
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes,
    };

    const order = await instance.orders.create(options);
    
    const supabase = getSupabaseClient();
    if (userId) {
      await supabase.from("transactions").insert({
        user_id: userId,
        order_id: orderId,
        razorpay_order_id: order.id,
        amount: amount,
        currency: currency,
        status: "created"
      });
    }

    return c.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay create order error:", error);
    return c.json({ error: error.message }, 500);
  }
};

const handleVerifyPayment = async (c: any) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, orderId } = await c.req.json();

    const secret = Deno.env.get("RAZORPAY_KEY_SECRET") || "secret";
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const supabase = getSupabaseClient();
      
      await supabase.from("transactions")
        .update({ status: "captured", razorpay_payment_id, razorpay_signature })
        .match({ razorpay_order_id });

      if (orderId) {
        await supabase.from("orders").update({ status: "confirmed" }).match({ id: orderId });
      }

      return c.json({ success: true, message: "Payment verified successfully" });
    } else {
      const supabase = getSupabaseClient();
      await supabase.from("transactions").update({ status: "failed" }).match({ razorpay_order_id });
      return c.json({ error: "Invalid signature" }, 400);
    }
  } catch (error: any) {
    console.error("Razorpay verify error:", error);
    return c.json({ error: error.message }, 500);
  }
};

app.post("*", async (c) => {
  const url = new URL(c.req.url);
  if (url.pathname.endsWith("/create-order")) {
    return handleCreateOrder(c);
  } else if (url.pathname.endsWith("/verify-payment")) {
    return handleVerifyPayment(c);
  }
  return c.json({ error: "Not Found", path: url.pathname }, 404);
});

app.get("*", (c) => c.json({ status: "ok", path: new URL(c.req.url).pathname }));

Deno.serve(app.fetch);