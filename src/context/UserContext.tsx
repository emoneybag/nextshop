"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";


type User = {
  name: string;
  email: string;
};


type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};



const UserContext = createContext<UserContextType | null>(null);



export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {


    const [user,setUser] = useState<User | null>(null);


    useEffect(() => {

        const loadUser = async () => {

            const storedUser =
            localStorage.getItem("user");


            if(storedUser){

            setUser(
                JSON.parse(storedUser)
            );

            }

        };


    loadUser();

}, []);



  function login(user:User){

    setUser(user);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

  }



  function logout(){

    setUser(null);

    localStorage.removeItem("user");

  }



  return (

    <UserContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >

      {children}

    </UserContext.Provider>

  );

}



export function useUser(){

  const context = useContext(UserContext);


  if(!context){

    throw new Error(
      "useUser must be inside UserProvider"
    );

  }


  return context;

}