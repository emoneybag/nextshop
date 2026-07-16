"use client";

import type { Product } from "@/types/product";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";


type CartItem = {
  product: Product;
  quantity: number;
};


type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  decreaseQuantity: (id: number) => void;
};


const CartContext = createContext<CartContextType | null>(null);



export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {


const [cart, setCart] = useState<CartItem[]>([]);
const [cartLoaded, setCartLoaded] = useState(false);


useEffect(() => {

  const loadCart = async () => {

    try {

      const storedCart = localStorage.getItem("cart");

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

    } catch(error) {

      console.error(
        "Failed to load cart:",
        error
      );

    }

    setCartLoaded(true);

  };


  loadCart();

}, []);

    useEffect(() => {

        if(!cartLoaded) return;


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

}, [cart, cartLoaded]);

  function addToCart(product: Product) {


    setCart((currentCart) => {


      const existingItem = currentCart.find(
        item => item.product.id === product.id
      );


      if(existingItem){

        return currentCart.map(item =>
          item.product.id === product.id
          ?
          {
            ...item,
            quantity: item.quantity + 1
          }
          :
          item
        );

      }


      return [
        ...currentCart,
        {
          product,
          quantity: 1
        }
      ];


    });


  }

  function decreaseQuantity(id:number){

  setCart(currentCart => {

    return currentCart
      .map(item => {

        if(item.product.id === id){

          return {
            ...item,
            quantity: item.quantity - 1
          };

        }

        return item;

      })
      .filter(item => item.quantity > 0);

  });

}



  function removeFromCart(id:number){

    setCart(currentCart =>
      currentCart.filter(
        item => item.product.id !== id
      )
    );

  }

  function clearCart(){

    setCart([]);
  }

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        decreaseQuantity,
      }}
    >

      {children}

    </CartContext.Provider>

  );

}



export function useCart(){

  const context = useContext(CartContext);


  if(!context){
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }


  return context;

}