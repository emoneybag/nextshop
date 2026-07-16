"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";


export default function RegisterPage(){

  const { login } = useUser();

  const router = useRouter();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");



  function handleSubmit(e:React.FormEvent){

    e.preventDefault();


    const newUser = {
      name,
      email,
    };


    login(newUser);


    router.push("/profile");

  }



  return (

    <main className="p-10">


      <h1 className="text-3xl font-bold">
        Create Account
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
        >
          Register
        </button>


      </form>


    </main>

  );

}