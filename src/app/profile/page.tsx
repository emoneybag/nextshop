"use client";

import { useUser } from "@/context/UserContext";


export default function ProfilePage(){

  const { user, logout } = useUser();


  if(!user){

    return (

      <main className="p-10">

        <h1 className="text-3xl">
          Not logged in
        </h1>

      </main>

    );

  }



  return (

    <main className="p-10">


      <h1 className="text-3xl font-bold">
        Profile
      </h1>


      <p className="mt-5">
        Name: {user.name}
      </p>


      <p>
        Email: {user.email}
      </p>


      <button
      onClick={logout}
      className="mt-5 bg-red-500 text-white px-5 py-2 rounded"
      >
        Logout
      </button>


    </main>

  );

}