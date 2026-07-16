"use client";

import { useCart } from "@/context/CartContext";


export default function CartPage(){

const {
  cart,
  addToCart,
  decreaseQuantity,
  removeFromCart
} = useCart();



  const total = cart.reduce(
    (sum,item) =>
      sum + item.product.price * item.quantity,
    0
  );



  return (

    <main className="p-10">

      <h1 className="text-3xl font-bold">
        Shopping Cart
      </h1>


      {
        cart.length === 0 ?

        (
          <p className="mt-5">
            Your cart is empty
          </p>
        )

        :

        (

          <div className="mt-5">


          {
            cart.map(item => (

              <div
              key={item.product.id}
              className="border p-4 mb-3 flex justify-between"
              >

                <div>

                  <h2 className="font-bold">
                    {item.product.name}
                  </h2>

                  <div className="flex gap-3 items-center">

                  <button
                  onClick={() => decreaseQuantity(item.product.id)}
                  className="border px-3"
                  >
                  -
                  </button>


                  <p>
                  {item.quantity}
                  </p>


                  <button
                  onClick={() => addToCart(item.product)}
                  className="border px-3"
                  >
                  +
                  </button>

                  </div>

                  <p>
                    ${item.product.price}
                  </p>

                </div>


                <button
                onClick={() =>
                  removeFromCart(item.product.id)
                }
                className="bg-red-500 text-white px-3 rounded"
                >
                  Remove
                </button>


              </div>

            ))
          }


          <h2 className="text-xl font-bold mt-5">
            Total: ${total.toFixed(2)}
          </h2>
          <a
          href="/checkout"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3 inline-block"
          >
            Proceed to Checkout
          </a>


          </div>

        )
      }


    </main>

  );

}