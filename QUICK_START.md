# 🚀 Quick Start Guide - Curated Crate Platform

## Getting Started in 5 Minutes

### 1️⃣ View the Application
The application should already be running in preview mode. If not visible, refresh the page.

### 2️⃣ Test User Accounts

You can create your own accounts or use these test scenarios:

#### As a Customer:
1. Click **"Register"** in the top navigation
2. Fill in your details:
   - Name: Your name
   - Email: customer@example.com
   - Password: password123
   - **Select Role: Customer (User)**
3. Click "Create Account"
4. You'll be automatically logged in and redirected to User Dashboard

#### As a Seller/Artisan:
1. Click **"Register"** in the top navigation
2. Fill in your details:
   - Name: Your name
   - Email: seller@example.com
   - Password: password123
   - **Select Role: Seller (Artisan/Business)**
3. Click "Create Account"
4. You'll be automatically logged in and redirected to Seller Dashboard

---

## 📱 What to Try

### Customer Journey:
1. **Browse Products** 
   - Go to "Products" in navigation
   - Use search and category filters
   - Click on any product to view details

2. **View Artisan Story**
   - On product detail page, scroll to "Meet the Artisan" section
   - Click "View Full Product Trace" to see complete journey
   - Try clicking "QR Code" button to see the traceable QR code

3. **Add to Cart**
   - Select quantity
   - Click "Add to Cart"
   - Notice cart count updates in header
   - Go to Cart page

4. **Checkout** (Test Payment)
   - Click "Proceed to Checkout"
   - Fill in shipping address
   - Click "Pay with Razorpay"
   - **Note**: This is demo mode - payment won't be processed
   - A success message will appear

5. **Subscribe to Monthly Box**
   - Go to "Subscriptions" in navigation
   - Choose ₹499 or ₹999 plan
   - Click "Subscribe Now"
   - Fill in Razorpay payment form (demo)

6. **View Dashboard**
   - Click "Dashboard" in navigation
   - See your orders and subscriptions
   - View stats

7. **Check Impact**
   - Go to "Impact" page
   - See how many artisans are supported
   - View artisan stories and regional impact

### Seller Journey:
1. **Add a Product**
   - Click "Add Product" button
   - Fill in product details:
     - Name, Price, Category, Description
     - **Artisan Story** (important!)
     - Artisan Name & Location
     - Craft Process
   - Upload an image (or select a file)
   - Click "Add Product"

2. **View Your Products**
   - See all your listed products in "My Products" tab
   - Each product shows image, price, and category

3. **Check Orders**
   - Go to "Orders Received" tab
   - View orders containing your products
   - See earnings from each order

4. **View Stats**
   - Dashboard shows:
     - Total Products
     - Total Orders
     - Total Earnings

---

## 🎯 Key Features to Explore

### QR Code Traceability
1. Go to any product detail page
2. Click the "QR Code" button
3. See the generated QR code
4. Or click "View Full Product Trace" at bottom
5. This shows the complete artisan journey

### Product Search & Filters
1. Go to Products page
2. Try searching: "lamp", "pot", "basket"
3. Use category dropdown to filter
4. Results update instantly

### Impact Dashboard
1. Go to Impact page
2. See real-time statistics
3. Read artisan success stories
4. View regional breakdown
5. Check progress towards 2026 goals

---

## 💳 Payment Testing

### Razorpay Integration (Demo Mode)

**Current Status**: Demo mode with test key

When you click "Pay with Razorpay":
- A Razorpay payment modal opens
- Use these test card details:
  - Card Number: `4111 1111 1111 1111`
  - Expiry: Any future date (e.g., 12/25)
  - CVV: Any 3 digits (e.g., 123)
  - Name: Your name

**Note**: In demo mode, actual payment processing is disabled. The order will be created successfully for testing purposes.

---

## 📊 Data Storage

**Important**: This demo uses browser localStorage for data persistence.

Your data includes:
- User accounts
- Products
- Orders
- Cart items
- Subscriptions

**To Reset Everything**:
1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh page
4. All demo data will be reloaded

---

## 🔍 Testing Scenarios

### Scenario 1: Complete Purchase Flow
1. Register as Customer
2. Browse products
3. Add 2-3 items to cart
4. Adjust quantities
5. Proceed to checkout
6. Complete payment
7. View order in dashboard

### Scenario 2: Artisan Listing Products
1. Register as Seller
2. Add 3 different products
3. View them in "My Products"
4. Note: You can't purchase your own products

### Scenario 3: Product Traceability
1. Go to any product detail
2. Click QR Code button
3. Copy the trace URL
4. Open in new tab
5. See complete artisan journey

### Scenario 4: Subscription
1. Register as Customer
2. Go to Subscriptions
3. Compare plans
4. Subscribe to Premium Box
5. View in User Dashboard

---

## 🐛 Troubleshooting

### Cart not updating?
- Try refreshing the page
- Check if you're logged in
- Make sure you selected "Customer" role (sellers can't purchase)

### Can't see products?
- Products are auto-loaded on first visit
- Try refreshing the page
- Check console for errors

### Login not working?
- Make sure email and password match what you registered
- Passwords are case-sensitive
- Try registering a new account

### QR Code not showing?
- Make sure you're on product detail or trace page
- Check browser console for errors
- Try a different product

---

## 📝 Sample Test Data

After first load, these sample products are available:

1. **Handcrafted Brass Lamp** - ₹1,299
2. **Terracotta Clay Pot Set** - ₹899
3. **Bamboo Woven Basket** - ₹649
4. **Wooden Carved Wall Panel** - ₹2,499
5. **Embroidered Table Runner** - ₹1,099
6. **Silver Oxidized Jewelry Set** - ₹1,799

Each product includes:
- Artisan name and location
- Complete craft story
- Traditional craft process
- Category and pricing

---

## 🎨 UI Elements to Notice

### Design Features:
- **Amber/Orange Theme**: Represents warmth and Indian heritage
- **Sticky Header**: Navigation always accessible
- **Responsive Design**: Works on mobile and desktop
- **Toast Notifications**: Success/error messages
- **Loading States**: Smooth transitions
- **Hover Effects**: Interactive elements
- **Badge Indicators**: Cart count, status labels

### Accessibility:
- Screen reader friendly
- Keyboard navigation support
- ARIA labels on interactive elements
- Semantic HTML structure

---

## ✅ Checklist: Try Everything!

- [ ] Register as Customer
- [ ] Register as Seller (use different email)
- [ ] Browse products
- [ ] Search for specific items
- [ ] Filter by category
- [ ] View product detail
- [ ] Read artisan story
- [ ] Generate QR code
- [ ] View product trace page
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Complete checkout
- [ ] Subscribe to monthly box
- [ ] View user dashboard
- [ ] Add product as seller
- [ ] View seller dashboard
- [ ] Check impact page
- [ ] Test responsive design (resize browser)

---

## 🚀 Next Steps

Want to take this to production?

1. **Backend Setup**
   - Set up Node.js/Express server
   - Configure PostgreSQL/MongoDB
   - Implement JWT authentication

2. **Razorpay Production**
   - Create production account
   - Get production API keys
   - Set up webhooks

3. **Cloud Storage**
   - Set up AWS S3 or Cloudinary
   - Implement image upload API
   - Configure CDN

4. **Deployment**
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to Heroku/AWS
   - Configure environment variables

---

## 💡 Tips for Best Experience

- Use Chrome or Firefox for best compatibility
- Enable JavaScript (required for app to work)
- Use desktop for full experience (mobile works too!)
- Try both customer and seller roles
- Explore all pages and features
- Check the Impact dashboard to see statistics

---

## 🙋‍♂️ Need Help?

If you encounter any issues:
1. Check browser console (F12) for errors
2. Try refreshing the page
3. Clear localStorage and start fresh
4. Make sure you're using a modern browser

---

**Enjoy exploring the Curated Crate Platform! 🎉**

Supporting artisans, one purchase at a time. ❤️
