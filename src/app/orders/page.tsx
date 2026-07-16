"use client";

import { useOrders } from "@/context/OrderContext";

export default function OrdersPage() {

  const { orders } = useOrders();

  return (

    <main className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            className="border p-4 mb-4 rounded"
          >

            <p>
              Order ID: {order.id}
            </p>

            <p>
              Total: ${order.total.toFixed(2)}
            </p>

            <p>
              Date: {new Date(
                order.date
              ).toLocaleString()}
            </p>

            <p>
              Items: {order.items.length}
            </p>

          </div>
        ))
      )}

    </main>

  );

}