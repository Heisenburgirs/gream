import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import Web3 from "web3";
import { useWeb3Auth } from "../../services/web3auth";
import { useToast } from "@/components/ui/use-toast"
import { useFlowContext } from '../../global/FlowContext';
import { useUserContext } from '../../global/UserContext';
import { getUserWalletAddress } from "../../firebase/firebase"

import  InitiateModal  from "../modal/InitiateModal";
import  SuccessModal  from "../modal/SuccessModal";

interface Props {
  flowType: "createFlow" | "updateFlow" | "deleteFlow";
}

const FlowModal: React.FC<Props> = ({ flowType }) => {
  const [recipient, setRecipient] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const {createFlow, toggleCreateFlow} = useFlowContext();
  const {updateFlow, toggleUpdateFlow} = useFlowContext();
  const {deleteFlow, toggleDeleteFlow} = useFlowContext();
  const [streamSuccess, setStreamSuccess] = useState(false);
  const [txResult, setTxResult] = useState(false);
	const {toast} = useToast()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  
  const { buttonName, setButtonName, RUDAddress, setRUDAddress } = useUserContext();

  const { web3Auth } = useWeb3Auth();

  useEffect(() => {

    const fetchProvider = async () => {
      if (window.ethereum && window.ethereum.isMiniPay) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        setProvider(provider);
      } else {
          console.error("MiniPay provider not detected");
      }
    }

    fetchProvider()
  }, [window.ethereum])

  const createNewFlow = async (recipientAddress: string, flowRate: string) => {
    try {
      const signer = provider?.getSigner();

      const network = await provider?.getNetwork();
      const chainId = network?.chainId;

      if (!provider) {
        console.error("Provider is not available.");
        return;
      }

      const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      });

      const superSigner = sf.createSigner({ signer: signer });

      const resolvedRecipient = await provider.resolveName(recipientAddress);
  
      const gToken = await sf.loadSuperToken("0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A");
  
      console.log(gToken);

      if (!resolvedRecipient) {
        console.log("Provider not initialized yet");
        return;
        }
        
      const createFlowOperation = await gToken.createFlow({
        sender: await superSigner.getAddress(),
        receiver: resolvedRecipient,
        flowRate: flowRate,
      });
  
      console.log(createFlowOperation);
      console.log("Creating your stream...");
  
      // Execute the flow creation transaction
      const result = await createFlowOperation.exec( superSigner );
      console.log(result);
  
      console.log(
        `Congrats - you've just created a money stream!
        `
      );
    } catch (error) {
      setTxResult(true)
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };

  async function updateExistingFlow(recipientAddress: string, flowRate: string) {
  
    const signer = provider?.getSigner();

    const network = await provider?.getNetwork();
    const chainId = network?.chainId;

    if (!provider) {
      console.error("Provider is not available.");
      return;
    }

    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });
  
    const superSigner = sf.createSigner({ signer: signer });

    const resolvedRecipient = await provider.resolveName(recipientAddress);
  
    console.log(signer);
    console.log(await superSigner.getAddress());
    const gToken = await sf.loadSuperToken("0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A");
  
    console.log(gToken);
  
    try {

      if (!resolvedRecipient) {
        console.error("Receiver is not available.");
        return;
      }

      const updateFlowOperation = gToken.updateFlow({
        sender: await superSigner.getAddress(),
        receiver: resolvedRecipient,
        flowRate: flowRate
        // userData?: string
      });
  
      console.log(updateFlowOperation);
      console.log("Updating your stream...");
  
      const result = await updateFlowOperation.exec(superSigner);
      console.log(result);
  
      console.log("flowrate", flowRate)
      console.log(
        `Congrats - you've just updated a money stream!
      `
      );
    } catch (error) {
      console.log("flowrate", flowRate)
      setTxResult(true)
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  async function deleteExistingFlow(RUDAddress: string) {
    const signer = provider?.getSigner();

    const network = await provider?.getNetwork();
    const chainId = network?.chainId;

    if (!provider) {
      console.error("Provider is not available.");
      return;
    }

    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });
  
    const superSigner = sf.createSigner({ signer: signer });

    const resolvedRecipient = await provider?.resolveName(RUDAddress);
  
    console.log(signer);
    console.log(await superSigner.getAddress());
    const gToken = await sf.loadSuperToken("0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A");
    
    try {

      if (!resolvedRecipient) {
        console.error("Provider is not available.");
        return;
      }

      const senderAddress = await signer?.getAddress();

      if (senderAddress) {
        const deleteFlowOperation = gToken.deleteFlow({
          sender: senderAddress,
          receiver: resolvedRecipient
          // userData?: string
        });
    
        console.log(deleteFlowOperation);
        console.log("Deleting your stream...");
    
        const result = await deleteFlowOperation.exec(superSigner);
        console.log(result);
    
        console.log(
          `Congrats - you've just updated a money stream!
        `
        );
      } 
    } catch (error) {
      setTxResult(true)
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  function calculateFlowRate(amount: string) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = parseFloat(monthlyAmount) * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  const handleRecipientChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };
  

  const handleFlowRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowRate(e.target.value);
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    
    if (newFlowRateDisplay !== undefined) {
      setFlowRateDisplay(newFlowRateDisplay.toString());
    }
    return
  };

  const handleFlow = async () => {

    let recipientAddress;

    if (buttonName === "Update" || buttonName === "Delete" || buttonName === "Reopen") {
      // Use RUDAddress directly for "Update," "Delete," and "Reopen" actions
      recipientAddress = RUDAddress ?? "";
    } else {
      // Perform the Firebase database check for other actions
      recipientAddress = recipient;
    }

    if (!recipientAddress && !flowRate && flowType !== "deleteFlow" && !buttonName) {
      // Check if recipient, flowRate or buttonName is empty
      toastMessage()
      return;
    }
    console.log("flowType", flowType)
    
    setIsButtonLoading(true);

    if (flowType === "createFlow") {
      if (buttonName === "Reopen") {
        try {
          await createNewFlow(RUDAddress ?? "", flowRate);
          setIsButtonLoading(false);
          setStreamSuccess(true)
          return;
        } catch (error) {
          // Handle error, if necessary
          setIsButtonLoading(false);
          console.log("error", error);
          return;
        }
      }
      
      try {
        await createNewFlow(recipientAddress, flowRate);
        setIsButtonLoading(false);
        setStreamSuccess(true)
  
      } catch (error) {
        // Handle error, if necessary
        setIsButtonLoading(false);
        console.log("error", error);
      }
    }

    if (flowType === "updateFlow") {
      if (buttonName === "Update") {
        try {
          await updateExistingFlow(RUDAddress ?? "", flowRate);
          setIsButtonLoading(false);
          setStreamSuccess(true)
          return;
        } catch (error) {
          // Handle error, if necessary
          setIsButtonLoading(false);
          console.log("error", error);
          return;
        }
      }

      try {
        await updateExistingFlow(recipientAddress, flowRate);
        setIsButtonLoading(false);
        setStreamSuccess(true)
  
      } catch (error) {
        // Handle error, if necessary
        setIsButtonLoading(false);
        console.log("error", error);
      }
    }

    if (flowType === "deleteFlow") {
      try {
        await deleteExistingFlow(RUDAddress ?? "");
        setIsButtonLoading(false);
        setStreamSuccess(true)
  
      } catch (error) {
        // Handle error, if necessary
        setIsButtonLoading(false);
        console.log("error", error);
      }
    }
  }; 

  const handleSuccessClose = () => {
    if (flowType === "createFlow") {
      toggleCreateFlow()
    }
    if (flowType === "updateFlow") {
      toggleUpdateFlow()
    }
    if (flowType === "deleteFlow") {
      toggleDeleteFlow()
    }
    setButtonName("")
    setRUDAddress("")
    setStreamSuccess(false)
    setTxResult(false)
  }

  const toastMessage = () => {
    toast({
      title: "Error",
      description: `${flowType === "deleteFlow" ? "Address missing" : "Address & Amount missing"}`,
    })
  }

  const toastMessageNoUser = () => {
    toast({
      title: "Error",
      description: "Twitter user has no address to stream to",
    })
  }

  const successMessages = {
    createFlow: {
      successMessage: "Stream Created!",
      failedMessage: "Failed to Create",
    },
    updateFlow: {
      successMessage: "Stream Updated!",
      failedMessage: "Failed to Update",
    },
    deleteFlow: {
      successMessage: "Stream Deleted!",
      failedMessage: "Failed to Delete",
    },
  };
  
  const successMessageData = successMessages[flowType];

  return (
    <div className="">
      {streamSuccess ? 
      (
        <SuccessModal
          handleSuccessClose={handleSuccessClose}
          successMessage={successMessageData.successMessage}
          failedTx={txResult}
          failedMessage={successMessageData.failedMessage}
          flowType={flowType}
        />
      )
      :
      (
      <InitiateModal
        streamSuccess={streamSuccess}
        handleSuccessClose={handleSuccessClose}
        recipient={recipient}
        handleRecipientChange={handleRecipientChange}
        flowRate={flowRate}
        handleFlowRateChange={handleFlowRateChange}
        flowRateDisplay={flowRateDisplay}
        toggleFlow={
          flowType === 'createFlow'
            ? toggleCreateFlow
            : flowType === 'updateFlow'
            ? toggleUpdateFlow
            : toggleDeleteFlow
        }
        isButtonLoading={isButtonLoading}
        handleFlow={handleFlow}
        displayFlowrate={flowType !== "deleteFlow"}
        titleText={
          flowType === 'createFlow'
            ? 'Create flow'
            : flowType === 'updateFlow'
            ? 'Update flow'
            : 'Delete flow'
        }
        subtitleText={
          flowType === 'createFlow'
            ? 'Stream $G in one-click.'
            : flowType === 'updateFlow'
            ? 'Update your $G flow'
            : 'Delete your $G Stream'
        }
        buttonText={flowType === 'deleteFlow' ? 'Delete' : 'Stream'}
        gMonth={
          flowType === 'updateFlow'
            ? 'New $G/Month'
            : flowType === 'deleteFlow'
            ? ''
            : '$G/Month'
        }
        flowType={flowType}
      />
      )}
    </div>
  );
};

export default FlowModal;