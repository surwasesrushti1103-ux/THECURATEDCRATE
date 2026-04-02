import { Link } from "react-router";
import { ArrowRight, Heart, Package, TrendingUp, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function Home() {
  const features = [
    {
      icon: Heart,
      title: "Support Artisans",
      description: "Every purchase directly supports rural artisans and their families",
    },
    {
      icon: Package,
      title: "Authentic Handicrafts",
      description: "100% handmade products with unique artisan stories",
    },
    {
      icon: TrendingUp,
      title: "Track Impact",
      description: "See the real impact of your purchases on artisan communities",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "The quality and authenticity of these handicrafts are unmatched. I love knowing my purchases support artisans directly.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      text: "The subscription box is amazing! Every month I get unique, beautiful items with fascinating stories.",
      rating: 5,
    },
    {
      name: "Anita Desai",
      location: "Bangalore",
      text: "This platform has helped me discover incredible artisans. The QR code feature that shows the artisan's story is brilliant!",
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBoYW5kaWNyYWZ0JTIwYXJ0aXNhbiUyMHdvcmtpbmd8ZW58MXx8fHwxNzc0OTY4NTk3fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
            opacity: 0.4,
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover India's <span className="text-amber-600">Finest Handicrafts</span>
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Connect with rural artisans, support traditional crafts, and bring authentic handmade treasures to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
                  Explore Products <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 w-full sm:w-auto">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Curated Crate?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than a marketplace - we're a bridge between tradition and modernity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition">
                <CardContent className="pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                    <feature.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Showcase */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Meet the Artisans Behind Your Products
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Every product on our platform comes with a unique QR code that tells the artisan's story - their name, location, and the traditional craft process they use.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                By scanning the QR code, you can trace your product's journey from the artisan's workshop to your doorstep.
              </p>
              <Link to="/products">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Discover Artisan Stories <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEluZGlhbiUyMHBvdHRlcnklMjBjcmFmdHxlbnwxfHx8fDE3NzQ5Njg1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Pottery craft"
                className="rounded-lg shadow-lg h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1773842298512-e49c9331cc3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB0ZXh0aWxlJTIwd2VhdmluZyUyMGxvb218ZW58MXx8fHwxNzc0OTY4NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Textile weaving"
                className="rounded-lg shadow-lg h-64 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1772648892987-d61017c13073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMEluZGlhbiUyMGRlY29yYXRpdmUlMjBpdGVtc3xlbnwxfHx8fDE3NzQ5Njg1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Decorative items"
                className="rounded-lg shadow-lg h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBoYW5kaWNyYWZ0JTIwYXJ0aXNhbiUyMHdvcmtpbmd8ZW58MXx8fHwxNzc0OTY4NTk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Artisan working"
                className="rounded-lg shadow-lg h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-20 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Monthly Curated Handicraft Boxes
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Receive handpicked artisan products every month. Choose from our ₹499 or ₹999 subscription plans.
          </p>
          <Link to="/subscription">
            <Button size="lg" variant="outline" className="bg-white text-amber-600 hover:bg-amber-50">
              View Subscription Plans
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact So Far
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600 mb-2">1,250+</div>
              <p className="text-lg text-gray-700">Artisans Supported</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600 mb-2">₹45L+</div>
              <p className="text-lg text-gray-700">Earnings to Artisans</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600 mb-2">8,500+</div>
              <p className="text-lg text-gray-700">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
