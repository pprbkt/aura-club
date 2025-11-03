"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

export type StockStatus = 'in-stock' | 'pre-order' | 'low-stock' | 'out-of-stock';
export type ProductCategory = 'electrical' | 'airframe' | 'mechanical' | 'drone';
export type SubCategory = string; // Dynamic based on category

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: SubCategory;
  description: string;
  price: number;
  salePrice?: number;
  brand: string;
  image?: string;
  images?: string[];
  stock: number;
  status: StockStatus;
  specifications: {
    [key: string]: string | number;
  };
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ShopContextType {
  products: Product[];
  orders: Order[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getProductsByCategory: (category: ProductCategory) => Product[];
  searchProducts: (query: string) => Product[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsCollection = collection(db, 'shop_products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      setOrders([]);
      return;
    }

    const ordersCollection = collection(db, 'shop_orders');
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(ordersData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });

    return () => unsubscribe();
  }, [user]);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      throw new Error('Only admins can add products');
    }
    await addDoc(collection(db, 'shop_products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  const updateProduct = async (productId: string, productUpdates: Partial<Product>) => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      throw new Error('Only admins can update products');
    }
    const productRef = doc(db, 'shop_products', productId);
    await updateDoc(productRef, {
      ...productUpdates,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteProduct = async (productId: string) => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      throw new Error('Only admins can delete products');
    }
    await deleteDoc(doc(db, 'shop_products', productId));
  };

  const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, 'shop_orders'), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      throw new Error('Only admins can update orders');
    }
    const orderRef = doc(db, 'shop_orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  };

  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(p => p.category === category);
  };

  const searchProducts = (searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    );
  };

  const value = {
    products,
    orders,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    getProductsByCategory,
    searchProducts,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
