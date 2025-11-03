"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(10, "Address is required"),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  cartItems: any[];
  totalPrice: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutDialog({
  cartItems,
  totalPrice,
  onClose,
  onSuccess,
}: CheckoutDialogProps) {
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to place an order",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const orderId = await createOrder({
        userId: user.uid,
        userEmail: data.email,
        userName: data.name,
        userPhone: data.phone,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
      });

      toast({
        title: "Order Placed",
        description: `Your order #${orderId} has been placed successfully. Admin will contact you soon.`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={onClose}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map(item => (
              <div key={item.productId} className="flex justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-sm text-amber-600 mt-3 p-2 bg-amber-50 rounded">
                💳 Cash on Delivery - Pay when you receive your order
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  {...register("name")}
                  placeholder="Your full name"
                  className="mt-1"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  {...register("email")}
                  placeholder="your@email.com"
                  className="mt-1"
                  defaultValue={user?.email || ""}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number *</label>
                <Input
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Delivery Address *</label>
                <textarea
                  {...register("address")}
                  placeholder="Complete delivery address with house number, street, city, postal code"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  rows={3}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Processing..." : "Place Order (COD)"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
