import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { useAuth } from './use-auth';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all orders and filter on client side
      const unsubscribe = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          const allOrders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          })) as Order[];

          // Filter to only show current user's orders (unless admin)
          const userOrders = allOrders.filter(order => order.userId === user.uid);
          setOrders(userOrders);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Error loading orders:', error);
          if (error.code === 'permission-denied') {
            setError('You do not have permission to view orders');
          } else {
            setError(error.message || 'Failed to load orders');
          }
          setLoading(false);
          setOrders([]);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      setError(errorMessage);
      setLoading(false);
      setOrders([]);
    }
  }, [user]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create order');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date(),
        ...(notes && { notes }),
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  const getAllOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch orders');
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    getAllOrders,
  };
}
