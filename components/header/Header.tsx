"use client"

import React, { useEffect, useState } from 'react';
import { useWeb3Auth } from "../../services/web3auth";
import { Button } from "@/components/ui/button"
import { ethers } from "ethers";
import { useUserContext } from '../../global/UserContext';
import Image from 'next/image';

export const Header = () => {
  /*const {
    provider,
    login, 
    logout,
  } = useWeb3Auth();*/

  const injected = window.ethereum
  const [signer, setSigner] = useState<string>()

  useEffect(() => {

    const fetchAddress = async () => {
      if (window.ethereum && window.ethereum.isMiniPay) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = provider.getSigner()
        const walletAddress = await wallet.getAddress()
        setSigner(walletAddress.toString())
      } else {
          console.error("MiniPay provider not detected");
      }
    }

    fetchAddress()
  }, [injected])

  const formatAddress = (signer: string) => {
    // Take the first 6 characters after '0x' and the last 4 characters
    if (signer) {
      return `${signer.substring(0, 6)}...${signer.substring(signer.length - 6)}`;
    }
  }

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text)
    .then(() => {
        console.log('Text copied to clipboard');
    })
    .catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const test = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    alert(provider)
  }

  const { userInfo } = useUserContext();

    return (
      <header className="border border-bottom border-borderColor py-4 px-8">
        <div className="flex justify-between items-end">
          <h1 className="text-black text-xl">Dashboard</h1>
          {/*<div className="flex gap-4 justify-center items-center">
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
          </div>*/}
          <div className="rounded-[5px] shadow px-4 py-2 font-bold" onClick={() => {copyToClipboard(signer)}}>{signer && formatAddress(signer)}</div>
        </div>
      </header>
    );
};