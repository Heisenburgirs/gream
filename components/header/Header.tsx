"use client"

import React from 'react';
import { useWeb3Auth } from "../../services/web3auth";
import { Button } from "@/components/ui/button"
import { ethers } from "ethers";
import { useUserContext } from '../../global/UserContext';
import Image from 'next/image';
import { getUser } from '../../firebase/firebase'

export const Header = () => {
  const {
    provider,
    login, 
    logout,
  } = useWeb3Auth();

  const { userInfo } = useUserContext();

    return (
      <header className="border border-bottom border-borderColor py-4 px-8">
        <div className="flex justify-between items-end">
          <h1 className="text-black text-xl">Dashboard</h1>
          <div className="flex gap-4 justify-center items-center">
            {provider && userInfo &&
            <div className="flex justify-center items-center gap-4 py-2 px-4 bg-borderColor border border-borderColor border-dotted rounded-[50px]">
              {userInfo && <span className="text-sm font-bold">@{userInfo.name}</span>}
              <Image src={userInfo?.profileImage ?? ""} alt={userInfo?.name ?? ""} width={28} height={28} className="rounded-[50px]" />
            </div>
            }
          < Button
              variant={provider ? "destructive" : "outline"}
              onClick={provider ? logout : login}
            >
              {provider ? 'Logout' : 'Log In'}
            </Button>
            </div>
        </div>
      </header>
    );
};