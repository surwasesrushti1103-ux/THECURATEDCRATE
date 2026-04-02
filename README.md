# 🛍️ Curated Crate Platform – Ethical Handicraft Marketplace

A full-stack web application connecting rural artisans with urban customers, built with React, TypeScript, and Tailwind CSS.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Key Functionalities](#key-functionalities)
- [Payment Integration](#payment-integration)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

## 🌟 Overview

**Curated Crate** is an ethical marketplace that bridges the gap between traditional Indian artisans and modern consumers. The platform enables artisans to showcase their handcrafted products while providing customers with authentic, traceable handicrafts with compelling artisan stories.

### Core Mission
- Support rural artisan communities
- Preserve traditional Indian crafts
- Provide transparent product traceability
- Create sustainable income opportunities

---

## ✨ Features

### For Customers (Users)
- ✅ Browse authentic handcrafted products
- ✅ View detailed product information with artisan stories
- ✅ Add products to cart and checkout
- ✅ Razorpay payment integration
- ✅ Subscribe to monthly curated boxes (₹499/₹999)
- ✅ View order history
- ✅ Track impact on artisan communities
- ✅ Scan QR codes to trace product origins

### For Sellers (Artisans)
- ✅ Register as a seller/artisan
- ✅ Add products with details and stories
- ✅ Upload product images
- ✅ Track orders received
- ✅ View total earnings
- ✅ Manage product inventory

### Special Features
- 🔍 **QR Code Traceability**: Each product has a unique QR code linking to its artisan story
- 📖 **Artisan Storytelling**: Every product includes the artisan's background and craft process
- 📊 **Impact Dashboard**: Real-time statistics on artisans supported and earnings generated
- 🔐 **Role-Based Authentication**: Separate dashboards for customers and sellers
- 📦 **Subscription Boxes**: Monthly curated handicraft deliveries

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4.x** - Styling
- **React Router 7.x** - Navigation
- **Lucide React** - Icons
- **Radix UI** - Accessible components
- **qrcode.react** - QR code generation
- **Sonner** - Toast notifications

### Backend & Storage
- **LocalStorage** - Client-side data persistence (demo)
- **Razorpay** - Payment gateway integration

### Development
- **Vite** - Build tool
- **TypeScript** - Type checking

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Modern web browser

### Installation

1. **Clone or access the project**

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### First Steps

1. **Register an account**
   - Go to `/register`
   - Choose either "Customer" or "Seller/Artisan" role
   - Fill in your details

2. **For Customers:**
   - Browse products at `/products`
   - View product details and artisan stories
   - Add to cart and checkout
   - Subscribe to monthly boxes

3. **For Sellers:**
   - Access seller dashboard
   - Click "Add Product"
   - Fill in product details and artisan story
   - Upload product image
   - Submit to list your product

---

## 👥 User Roles

### Customer/User
- Can browse and purchase products
- Access to cart and checkout
- View order history
- Subscribe to monthly boxes
- View impact dashboard

### Seller/Artisan
- Can add and manage products
- View orders received
- Track earnings
- Provide artisan stories and craft details

### Role-Based Routing
- Users are automatically redirected to appropriate dashboards after login
- Sellers cannot purchase products
- Users cannot access seller features

---

## 🔑 Key Functionalities

### Authentication System
```typescript
// Located in: /src/app/pages/Login.tsx and Register.tsx

// User data structure
{
  id: string,
  name: string,
  email: string,
  password: string,  // In production, use proper hashing
  role: "user" | "seller",
  createdAt: string
}
```

### Product Management
```typescript
// Located in: /src/app/utils/dataManager.ts

// Product structure
{
  id: string,
  name: string,
  price: number,
  description: string,
  story: string,  // Artisan story
  image: string,
  sellerId: string,
  artisanName: string,
  artisanLocation: string,
  craftProcess: string,
  category: string,
  createdAt: string
}
```

### Cart System
- Add multiple products
- Update quantities
- Remove items
- Automatic cart count updates
- Persistent cart (localStorage)

### Order Processing
```typescript
// Order structure
{
  id: string,
  userId: string,
  items: CartItem[],
  subtotal: number,
  shipping: number,
  total: number,
  paymentId: string,
  status: "confirmed" | "processing" | "shipped" | "delivered",
  shippingAddress: Address,
  createdAt: string
}
```

### QR Code System
- Generated for each product
- Links to `/trace/:productId` page
- Shows complete artisan information
- Shareable via URL

---

## 💳 Payment Integration

### Razorpay Setup

The app uses **Razorpay** for payment processing (India's leading payment gateway).

#### Demo Configuration
Currently uses test key: `rzp_test_demo`

#### Production Setup

1. **Create Razorpay Account**
   - Sign up at https://razorpay.com
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings → API Keys
   - Generate Key ID and Key Secret

3. **Update Code**
   
   In `/src/app/pages/Checkout.tsx`:
   ```typescript
   const options = {
     key: "YOUR_RAZORPAY_KEY_ID", // Replace rzp_test_demo
     // ... rest of options
   };
   ```

4. **Test Payment**
   - Use test cards: 4111 1111 1111 1111
   - Any future expiry date
   - Any CVV

5. **Production Checklist**
   - ✅ Verify webhook setup
   - ✅ Enable payment methods
   - ✅ Set up settlement account
   - ✅ Configure email notifications

### Subscription Payments
Monthly subscription charges are handled similarly with recurring payment setup.

---

## 📁 Project Structure

```
curated-crate-platform/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   └── figma/           # Image components
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── ProductListing.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── SellerDashboard.tsx
│   │   │   ├── Subscription.tsx
│   │   │   ├── ProductTrace.tsx  # QR trace page
│   │   │   ├── Impact.tsx        # Impact dashboard
│   │   │   └── NotFound.tsx
│   │   ├── utils/
│   │   │   └── dataManager.ts   # Data management utilities
│   │   ├── App.tsx              # Main app component
│   │   ├── routes.tsx           # Route configuration
│   │   └── Root.tsx             # Root layout with nav/footer
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── package.json
└── README.md
```

---

## 📡 API Reference

### Data Management Functions

Located in `/src/app/utils/dataManager.ts`

#### Products
```typescript
getProducts(): Product[]
getProductById(id: string): Product | undefined
addProduct(product: ProductInput): Product
getSellerProducts(sellerId: string): Product[]
```

#### Cart
```typescript
getCart(): CartItem[]
addToCart(productId: string): void
removeFromCart(productId: string): void
updateCartQuantity(productId: string, quantity: number): void
clearCart(): void
```

#### Orders
```typescript
addOrder(order: OrderInput): Order
getUserOrders(userId: string): Order[]
getSellerOrders(sellerId: string): Order[]
```

#### Subscriptions
```typescript
addSubscription(subscription: SubscriptionInput): Subscription
getUserSubscriptions(userId: string): Subscription[]
```

---

## 📸 Screenshots

### Key Pages

**Home Page**
- Hero section with artisan imagery
- Feature highlights
- Testimonials
- Impact statistics

**Product Listing**
- Grid layout with product cards
- Search and filter functionality
- Category filters

**Product Detail**
- Large product image
- Artisan story section
- QR code generation
- Add to cart functionality

**Product Trace Page**
- QR code display
- Complete artisan journey
- Craft process details
- Impact statement

**Dashboards**
- User: Orders, subscriptions, stats
- Seller: Products, orders, earnings

---

## 🔐 Security Notes

### Current Implementation (Demo)
- Passwords stored in plain text (localStorage)
- Client-side authentication only
- No server-side validation

### Production Recommendations

1. **Authentication**
   - Implement proper backend authentication
   - Use bcrypt for password hashing
   - Implement JWT tokens
   - Add session management

2. **Data Storage**
   - Move from localStorage to database
   - Implement proper API endpoints
   - Add input validation and sanitization
   - Use HTTPS for all communications

3. **Payment Security**
   - Store API keys in environment variables
   - Implement webhook verification
   - Add order verification logic
   - Enable 3D Secure payments

4. **File Uploads**
   - Implement proper image upload to cloud storage
   - Add file type and size validation
   - Scan for malware
   - Compress and optimize images

---

## 🎯 Future Enhancements

### Phase 1 (Immediate)
- [ ] Backend API with Node.js/Express
- [ ] PostgreSQL/MongoDB database
- [ ] Real authentication with JWT
- [ ] Cloud image storage (AWS S3/Cloudinary)
- [ ] Email notifications

### Phase 2 (Short-term)
- [ ] Product reviews and ratings
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Order tracking with status updates
- [ ] Chat support

### Phase 3 (Long-term)
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Artisan video stories
- [ ] Live workshops and events
- [ ] International shipping
- [ ] Multi-language support
- [ ] AI-powered recommendations

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit for review

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components modular and reusable

---

## 📝 License

This project is for educational and demonstration purposes.

---

## 👨‍💻 Support

For questions or issues:
- Email: support@curatedcrate.com
- Phone: +91 1234567890

---

## 🙏 Acknowledgments

- All artisan communities across India
- Unsplash for product imagery
- Razorpay for payment infrastructure
- Open source community

---

**Built with ❤️ to support Indian artisans and preserve traditional crafts**
