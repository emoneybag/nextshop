"use client";

import { useEffect } from "react";

import {
  createContext,
  useContext,
  useState,
} from "react";

import type { Order } from "@/types/order";

type OrderContextType = {
  orders: Order[];
  createOrder: (order: Order) => void;
};

const OrderContext =
  createContext<OrderContextType | null>(
    null
  );

export function OrderProvider({
  children,
}: {
  children: React.ReactNode;
}) {

    function createOrder(order: Order) {

        setOrders(currentOrders => [
            ...currentOrders,
            order,
        ]);

    }

    const [orders, setOrders] =
    useState<Order[]>([]);

    const [ordersLoaded, setOrdersLoaded] =
    useState(false);

    useEffect(() => {

    try {

        const storedOrders =
        localStorage.getItem("orders");

        if(storedOrders){

        setOrders(
            JSON.parse(storedOrders)
        );

        }

    } catch(error){

        console.error(
        "Failed to load orders:",
        error
        );

    } finally {

        setOrdersLoaded(true);

    }

    }, []);

    useEffect(() => {

    if(!ordersLoaded) return;

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}, [orders, ordersLoaded]);

    return (

    <OrderContext.Provider
    value={{
        orders,
        createOrder,
    }}
    >

      {children}

    </OrderContext.Provider>

  );

}

export function useOrders(){

  const context =
    useContext(OrderContext);

  if(!context){

    throw new Error(
      "useOrders must be used inside OrderProvider"
    );

  }

  return context;

}