"use client"

import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '../components/header/Header';
import { WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";
import { CHAIN_CONFIG_TYPE } from "../config/chainConfig";
import { Sidebar } from '../components/sidebar/Sidebar';
import { Web3AuthProvider } from "../services/web3auth";
import { FlowProviderComponent } from "../global/FlowContext"
import React, { useState } from 'react';
import { UserProviderComponent } from '../global/UserContext';
import { Toaster } from "@/components/ui/toaster"
import dotenv from 'dotenv';
dotenv.config();

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [web3AuthNetwork, setWeb3AuthNetwork] = useState<WEB3AUTH_NETWORK_TYPE>("mainnet");
  const [chain, setChain] = useState<CHAIN_CONFIG_TYPE>("celo");

  //<Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
  //</Web3AuthProvider>

  return (
    <UserProviderComponent>
      <FlowProviderComponent>
        <html lang="en">
          <body className="inter flex flex-col h-screen">
            <div className="flex flex-1">
              {/*<Sidebar />*/}
              <div className="w-full flex flex-col">
                <Header />
                {children}
                <Toaster />
              </div>
            </div>
          </body>
        </html>
      </FlowProviderComponent>
    </UserProviderComponent>
  );
}