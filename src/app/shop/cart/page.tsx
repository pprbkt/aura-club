"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "@/components/shop/checkout-dialog";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <div>
            <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!showCheckout ? (
        <>
          <div className="flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <Link href="/shop" className="text-primary hover:underline">
              Back to Shop
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <Card key={item.productId}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <p className="text-lg font-bold mb-3">₹{item.price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Total: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            removeFromCart(item.productId);
                            toast({
                              title: "Removed",
                              description: `${item.name} removed from cart`,
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 border-b pb-4">
                    <div className="flex justify-between text-sm">
                      <span>Items:</span>
                      <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => clearCart()}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <CheckoutDialog
          cartItems={cart}
          totalPrice={getTotalPrice()}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            clearCart();
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}
