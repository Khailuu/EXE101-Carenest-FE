'use client'

import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";

export default function HeaderComponent() {
  const router = useRouter()
  const user = true
  return (
    <div>
      <div className="bg-[#2a9d8f] flex justify-between items-center">
        <div>
          <img src="/images/banner.png" className="w-[100px]" alt="" />
        </div>
    {
      user ? (
                <div className="mr-[40px]">
          <Button
            style={{
              backgroundColor: "#fff",
              border: "none",
            }}
             onClick={() => router.push("/login")}
          >
            Sign in
          </Button>
          <Button
          className="hover:bg-"
            style={{
              backgroundColor: "#2a9d8f",
              border: "1px #fff solid",
              marginLeft: "15px",
              color: "white"
            }}
             onClick={() => router.push("/register/store-register")}

          >
            Sign up
          </Button>
        </div>
      ) : ( 
        <div>

        </div>
      )
    }
      </div>
      <div className="bg-[#d9d9d9] pl-[100px] pr-[100px]">
            <ul className="flex justify-around pt-[10px] pb-[10px]">
              <li className="font-medium text-[18px]">
                <Link href="/">Home</Link>
              </li>
              <li className="font-medium text-[18px]">
                <Link href="/store">Store</Link>
              </li>
              <li className="font-medium text-[18px]">
                <Link href="">Services</Link>
              </li>
              <li className="font-medium text-[18px]">
                <Link href="">Blogs</Link>
              </li>
              <li className="font-medium text-[18px]">
                <Link href="">Contact</Link>
              </li>
              <li className="font-medium text-[18px]">
                <Link href="">Your Wallet</Link>
              </li>
            </ul>
      </div>
    </div>
  );
}
