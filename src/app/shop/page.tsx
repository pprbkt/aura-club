"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useShop, ProductCategory } from "@/hooks/use-shop";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'electrical', label: 'Electrical & Power Systems' },
  { value: 'airframe', label: 'Airframe Building Materials' },
  { value: 'mechanical', label: 'Mechanical & Control Components' },
  { value: 'drone', label: 'Drone & Multi-Rotor Specific' },
];

const STOCK_STATUS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'pre-order', label: 'Pre-Order' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
];

export default function ShopPage() {
  const { products, loading } = useShop();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  // Get unique brands
  const brands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))].sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(product.status);

      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, priceRange, selectedBrands, selectedStatus]);

  const handleAddToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    toast({
      title: "Added to Cart",
      description: "Product added successfully",
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setSelectedStatus([]);
  };

  return (
    <div className="flex gap-6 container mx-auto px-4 py-8">
      {/* Sidebar Filters */}
      <aside className="w-72 flex-shrink-0">
        <Card className="bg-card border-border/60 sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">Filters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="w-full mt-2"
            >
              Clear All Filters
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedCategory === 'all'}
                    onCheckedChange={() => setSelectedCategory('all')}
                  />
                  <span className="text-sm">All Categories</span>
                </label>
                {CATEGORIES.map(cat => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedCategory === cat.value}
                      onCheckedChange={() => setSelectedCategory(cat.value)}
                    />
                    <span className="text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
                className="mb-3"
              />
              <div className="flex gap-2 text-sm">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20"
                />
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold mb-3">Brands</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <h3 className="font-semibold mb-3">Stock Status</h3>
              <div className="space-y-2">
                {STOCK_STATUS.map(status => (
                  <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedStatus.includes(status.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStatus([...selectedStatus, status.value]);
                        } else {
                          setSelectedStatus(selectedStatus.filter(s => s !== status.value));
                        }
                      }}
                    />
                    <span className="text-sm">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Products */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="font-headline text-4xl font-bold mb-2">Club Shop</h1>
          <p className="text-muted-foreground">
            Quality components for RC enthusiasts and model builders
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="text-sm text-muted-foreground">
            Cart: {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <Card key={product.id} className="bg-card border-border/60 hover:border-border transition-colors flex flex-col">
                {product.image && (
                  <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="font-headline text-base line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.brand}</CardDescription>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'in-stock' ? 'bg-green-500/20 text-green-600' :
                      product.status === 'low-stock' ? 'bg-yellow-500/20 text-yellow-600' :
                      product.status === 'pre-order' ? 'bg-blue-500/20 text-blue-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {product.status === 'in-stock' ? 'In Stock' :
                       product.status === 'low-stock' ? 'Low Stock' :
                       product.status === 'pre-order' ? 'Pre-Order' :
                       'Out of Stock'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.salePrice && (
                      <span className="text-sm line-through text-muted-foreground">${product.salePrice}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.status === 'out-of-stock'}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-lg font-medium text-muted-foreground">No products match your filters</p>
            <Button variant="ghost" onClick={handleClearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
