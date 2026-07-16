"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";


export default function Navbar(){

  const { user } = useUser();


  return (

    <nav className="p-5 border-b flex gap-6">


      <Link href="/">
        Home
      </Link>


      <Link href="/products">
        Products
      </Link>


      <Link href="/cart">
        Cart
      </Link>


      <Link href="/contact">
        Contact
      </Link>


      {
        user ? (

          <Link href="/profile">
            Profile
          </Link>

        ) : (

          <Link href="/register">
            Register
          </Link>

        )
      }


    </nav>

  );

}