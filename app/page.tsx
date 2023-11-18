"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import FlowModal from '../components/flows/FlowModal';
import { useFlowContext } from '../global/FlowContext';
import { DisplayFlow } from '../components/flows/DisplayFlow'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [cityList, setCityList] = useState([]);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [userWalletAddress, setWalletAddress] = useState("");
  const {createFlow, toggleCreateFlow} = useFlowContext();
  const {updateFlow, toggleUpdateFlow} = useFlowContext();
  const {deleteFlow, toggleDeleteFlow} = useFlowContext();

  return (
    <main className="flex flex-col items-center justify-between p-8 text-black text-[50px] font-sans">
      <div className="w-full h-full flex flex-col">
          <div className="max-h-[500px] overflow-y-auto">
            <DisplayFlow />
          </div>
      </div>

      {createFlow || updateFlow || deleteFlow ? (
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          <FlowModal
            flowType={
              createFlow ? 'createFlow' : updateFlow ? 'updateFlow' : 'deleteFlow'
            }
          />
        </div>
      ) : null}
      {/*{updateFlowModal && <UpdateFlow onClose={toggleUpdateFlowModal} />}*/}
    </main>
  )
}
