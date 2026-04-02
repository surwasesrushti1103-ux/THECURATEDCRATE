import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Heart, Users, TrendingUp, IndianRupee, MapPin, Package } from "lucide-react";
import { getProducts, initializeMockData } from "../utils/dataManager";

export default function Impact() {
  const [stats, setStats] = useState({
    artisansSupported: 0,
    totalPurchases: 0,
    totalEarnings: 0,
    regions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Calculate impact statistics asynchronously
        const products = await getProducts();
        const uniqueArtisans = new Set(products.map((p: any) => p.artisanName));
        const uniqueRegions = new Set(products.map((p: any) => p.artisanLocation));
        
        // Get orders from localStorage or DB wrapper (for simple mock stats)
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const totalPurchases = orders.length;
        const totalEarnings = orders.reduce((sum: number, order: any) => sum + order.total, 0);

        setStats({
          artisansSupported: uniqueArtisans.size + 1245, // Base number + actual
          totalPurchases: totalPurchases + 8500,
          totalEarnings: totalEarnings + 4500000, // ₹45L base
          regions: uniqueRegions.size + 28,
        });
      } catch (err) {
        console.error("Error computing stats:", err);
      }
    };

    fetchStats();
  }, []);

  const impactStories = [
    {
      name: "Meera Sharma",
      location: "Rajasthan",
      story: "Thanks to Curated Crate, I can now send my children to school while continuing my traditional embroidery work.",
      craft: "Embroidery",
      income: "₹18,000/month",
    },
    {
      name: "Ravi Kumar",
      location: "Tamil Nadu",
      story: "The platform has given me access to customers across India. My pottery business has grown 3x in the past year.",
      craft: "Pottery",
      income: "₹25,000/month",
    },
    {
      name: "Anjali Das",
      location: "West Bengal",
      story: "I was struggling to sell my products locally. Now I have regular orders and a stable income.",
      craft: "Textile Weaving",
      income: "₹22,000/month",
    },
  ];

  const regionalImpact = [
    { region: "North India", artisans: 385, crafts: "Brass work, Wood carving, Embroidery" },
    { region: "South India", artisans: 420, crafts: "Pottery, Stone carving, Silk weaving" },
    { region: "East India", artisans: 298, crafts: "Bamboo crafts, Textile, Dokra art" },
    { region: "West India", artisans: 350, crafts: "Block printing, Mirror work, Bandhani" },
  ];

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 rounded-full mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Impact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Together, we're transforming lives and preserving India's rich handicraft heritage. 
            Here's the real impact your purchases are making.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">{stats.artisansSupported.toLocaleString()}</p>
              <p className="text-blue-100">Artisans Supported</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-8 text-center">
              <IndianRupee className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">
                ₹{(stats.totalEarnings / 100000).toFixed(1)}L
              </p>
              <p className="text-green-100">Earnings to Artisans</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">{stats.totalPurchases.toLocaleString()}</p>
              <p className="text-purple-100">Products Sold</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">{stats.regions}</p>
              <p className="text-amber-100">Regions Covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Impact Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Real Stories, Real Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{story.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {story.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{story.story}"</p>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Craft</span>
                      <span className="font-semibold">{story.craft}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Income</span>
                      <span className="font-semibold text-green-600">{story.income}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regional Impact */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Regional Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalImpact.map((region, index) => (
              <Card key={index} className="border-l-4 border-l-amber-600">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{region.region}</h3>
                      <p className="text-2xl font-bold text-amber-600 mb-2">
                        {region.artisans} Artisans
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Traditional Crafts:</strong> {region.crafts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Breakdown */}
        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white mb-16">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-center mb-12">How Your Purchase Makes a Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">70%</div>
                <p className="text-xl mb-2">Goes Directly to Artisans</p>
                <p className="text-amber-100 text-sm">
                  The majority of your payment goes directly to the artisan who crafted your product
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">20%</div>
                <p className="text-xl mb-2">Platform Operations</p>
                <p className="text-amber-100 text-sm">
                  Covers logistics, customer support, and maintaining the platform
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">10%</div>
                <p className="text-xl mb-2">Artisan Development</p>
                <p className="text-amber-100 text-sm">
                  Invested in training programs and community development initiatives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <div className="bg-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our 2026 Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                goal: "Support 5,000 Artisans",
                progress: (stats.artisansSupported / 5000) * 100,
                current: stats.artisansSupported,
                target: 5000,
              },
              {
                icon: IndianRupee,
                goal: "₹2 Crore to Artisans",
                progress: (stats.totalEarnings / 20000000) * 100,
                current: `₹${(stats.totalEarnings / 100000).toFixed(1)}L`,
                target: "₹2Cr",
              },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="w-8 h-8 text-amber-600" />
                  <div>
                    <h3 className="text-xl font-bold">{item.goal}</h3>
                    <p className="text-sm text-gray-600">
                      {item.current} / {item.target}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-amber-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-2">
                  {item.progress.toFixed(1)}% Complete
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
