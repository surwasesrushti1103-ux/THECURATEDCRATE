import { supabase } from "./supabaseClient";

// Helper to get current mock user from localStorage until Auth is migrated
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export async function initializeMockData() {
  // No longer generating mock data. The app now relies on Supabase DB completely.
  localStorage.setItem("dataInitialized", "true");
}

// Get all products from DB
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

// Get product by ID
export async function getProductById(id: string) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

// Add product (seller)
export async function addProduct(product: any) {
  const user = getCurrentUser();
  if (!user) throw new Error("Must be logged in as seller to add products");

  const newProduct = {
    ...product,
    seller_id: user.id
  };

  const { data, error } = await supabase.from("products").insert([newProduct]).select().single();
  if (error) throw error;
  return data;
}

// For cart, to simplify the migration and keep guest cart working,
// we will maintain the cart in localStorage, but Orders will go to DB.
export function getCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.filter((item: any) => item && item.productId);
}

export function addToCart(productId: string) {
  const cart = getCart();
  const existingItem = cart.find((item: any) => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length.toString());
}

export function removeFromCart(productId: string) {
  let cart = getCart();
  cart = cart.filter((item: any) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length.toString());
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((item: any) => item.productId === productId);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

export function clearCart() {
  localStorage.setItem("cart", JSON.stringify([]));
  localStorage.setItem("cartCount", "0");
}

// Add order to DB
export async function addOrder(orderData: any) {
  const { 
    userId, subtotal, shipping, total, paymentId, status, shippingAddress, items
  } = orderData;

  // Insert main order record
  const { data: order, error: orderError } = await supabase.from("orders").insert([{
    user_id: userId,
    subtotal,
    shipping,
    total,
    status,
    shipping_address: shippingAddress
  }]).select().single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_time: item.product.price
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
}

// Get user orders
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase.from("orders")
    .select(`*, order_items(*, products(*))`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
  return data;
}

// Get seller orders
export async function getSellerOrders(sellerId: string) {
  // This requires a more complex join, achieved through a custom view or subquery in Supabase
  // For simplicity using JS filtering after fetching items linked to this seller's products
  const { data: products } = await supabase.from("products").select("id").eq("seller_id", sellerId);
  const sellerProductIds = products?.map(p => p.id) || [];

  if (sellerProductIds.length === 0) return [];

  const { data: orderItems, error } = await supabase.from("order_items")
    .select(`order_id, orders(*), products(*)`)
    .in("product_id", sellerProductIds);

  if (error) return [];

  // Group by order
  const ordersMap = new Map();
  orderItems?.forEach((item: any) => {
    if (!ordersMap.has(item.order_id)) {
      ordersMap.set(item.order_id, {
        ...item.orders,
        items: []
      });
    }
    ordersMap.get(item.order_id).items.push(item);
  });

  return Array.from(ordersMap.values());
}

// Get seller products
export async function getSellerProducts(sellerId: string) {
  const { data, error } = await supabase.from("products").select("*").eq("seller_id", sellerId);
  if (error) return [];
  return data;
}

// Add subscription
export async function addSubscription(subscription: any) {
  const { data, error } = await supabase.from("subscriptions").insert([{
    user_id: subscription.userId,
    plan_name: subscription.planId,
    price: subscription.amount,
    interval: subscription.interval,
    status: subscription.status || "active",
  }]).select().single();

  if (error) throw error;
  return data;
}

// Get user subscriptions
export async function getUserSubscriptions(userId: string) {
  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId);
  if (error) return [];
  return data;
}
