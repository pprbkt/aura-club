"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/hooks/use-orders";
import { Textarea } from "@/components/ui/textarea";

interface UpdateOrderStatusDialogProps {
  order: Order;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (status: Order['status'], notes?: string) => Promise<void>;
}

export function UpdateOrderStatusDialog({
  order,
  isOpen,
  onOpenChange,
  onStatusUpdate,
}: UpdateOrderStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<Order['status']>(order.status);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onStatusUpdate(newStatus, notes || undefined);
      onOpenChange(false);
      setNotes("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>Order ID: {order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">New Status</label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about this order update..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading || newStatus === order.status}>
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
