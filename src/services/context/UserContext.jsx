"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';
import { Login, Logout, Me } from '../api/userRequests';
import { LoadingOutlined } from '@ant-design/icons';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import { Spin } from 'antd';

export const UserContext = createContext();

function UserContextProvider({children}) {
    const router = useRouter();
    const pathname = usePathname();

    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
    //   const token = getCookie("token");
      
    //   if (token) {
        Me()
        .then(res => {
            setUser(res.data.user);
            toast.success(res.data.message)
        })
        .catch(err => {
            setUser(null);
            toast.error(err.response.data);
        })
        .finally(() => {
            setLoading(false);
        });
    //   } else {
    //       setUser(null);
    //       setLoading(false);
    //   }
  }, []);

    useEffect(() => {
      if (!loading) {
            if (user && pathname === "/login") {
                router.push("/");
            } else if (!user && pathname !== "/login") {
                router.push("/login");
            }
        }
    }, [user, loading]);

    function handleLogIn({username, password}) {
        Login(username, password)
        .then(res => {
            toast.success(res.message);
            setUser(res.user);
        })
        .catch(err=>{
            toast.error(err.response.data);
        })
    }

    function handleLogOut() {
        Logout()
        .then((res) => {
            toast.success(res.message)
            setUser(null);
        })
        .catch(err=>{
            toast.error(err.response.data);
        })
    }

    return (
        <UserContext.Provider value={{ user, setUser, handleLogIn, handleLogOut }}>
            {loading ? <div className="flex w-screen h-screen items-center justify-center cursor-wait"><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></div> : children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
