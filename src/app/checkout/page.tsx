"use client";

import { useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";


export default function CheckoutPage(){

  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useUser();
  console.log("Current user:", user);

  const router = useRouter();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");



  function handleSubmit(e: React.FormEvent){

    e.preventDefault();


    console.log({
      name,
      email,
      cart
    });


    router.push("/success");

  }

  function handleCheckout() {

    if (!user) {
      alert("Please register first");
      return;
    }

    const total = cart.reduce(
      (sum, item) =>
        sum +
        item.product.price * item.quantity,
      0
    );

    createOrder({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: cart,
      total,
      customerEmail: user.email,
    });

    clearCart();

    router.push("/success");
  }



  return (

    <main className="p-10">


      <h1 className="text-3xl font-bold">
        Checkout
      </h1>


      <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-md space-y-4"
      >


        <input
        className="border p-3 w-full"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />


        <input
        className="border p-3 w-full"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />


        <button
          className="bg-black text-white px-5 py-3 rounded"
          onClick={handleCheckout}
        >
          Place Order
        </button>


      </form>


    </main>

  );

}