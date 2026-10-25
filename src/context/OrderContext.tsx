"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Order } from "@/types/order";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

const STORAGE_KEY = "nextshop:orders:v2";

type OrderContextType = {
  orders: Order[];
  hydrated: boolean;
  createOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(loadFromStorage<Order[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(STORAGE_KEY, orders);
  }, [orders, hydrated]);

  const createOrder = (order: Order) =>
    setOrders((current) => [order, ...current]);

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, hydrated, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used inside OrderProvider");
  return context;
}
