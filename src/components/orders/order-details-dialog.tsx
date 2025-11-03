"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsDialogProps {
  order: Order;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-600';
      case 'processing':
        return 'bg-purple-500/20 text-purple-600';
      case 'delivered':
        return 'bg-green-500/20 text-green-600';
      case 'cancelled':
        return 'bg-red-500/20 text-red-600';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order ID: {order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{order.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{order.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{order.userPhone}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div>
            <h3 className="font-semibold mb-3">Order Status</h3>
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(order.status)} capitalize`}>
                {order.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                <p>Created: {order.createdAt.toLocaleString('en-IN')}</p>
                <p>Updated: {order.updatedAt.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-sm text-amber-600 mt-2 p-2 bg-amber-50 rounded">
              💳 Cash on Delivery (COD)
            </p>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm p-2 bg-muted rounded">{order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
