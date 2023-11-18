import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import success from "../../public/success.png";
import { useUserContext } from '../../global/UserContext';
import { ethers } from "ethers";

interface Props {
  streamSuccess: boolean;
  handleSuccessClose: () => void;
  recipient: string;
  handleRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  flowRate: string;
  handleFlowRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  flowRateDisplay: string;
  toggleFlow: () => void;
  isButtonLoading: boolean;
  handleFlow: () => void;
  displayFlowrate: boolean;
  titleText: string;
  subtitleText: string;
  buttonText: string;
  flowType: string;
  gMonth: string;
}

const InitiateModal: React.FC<Props> = ({
  recipient,
  handleRecipientChange,
  flowRate,
  handleFlowRateChange,
  flowRateDisplay,
  toggleFlow,
  isButtonLoading,
  handleFlow,
  displayFlowrate,
  titleText,
  subtitleText,
  buttonText,
  flowType,
  gMonth,
  }) => {

  const { buttonName, setButtonName } = useUserContext();

  return (
    <Card className="sm:w-[350px] md:w-[500px] p-4">
      <CardHeader>
            <CardTitle className="text-3xl">
              {titleText}
            </CardTitle>
            <CardDescription className="text-sm2">{subtitleText}</CardDescription>
          </CardHeader>
          <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  {buttonName !== "Update" && buttonName !== "Delete" && buttonName !== "Reopen" &&(
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-xl">Receiver</Label>
                    <div className="relative text-base">
                      <Input
                      className="text-base pl-[30px] py-2"
                      id="name" 
                      placeholder="Enter address..."
                      name="recipient"
                      value={recipient}
                      onChange={handleRecipientChange}
                      />
                    </div>
                  </div>
                  )}
                  {buttonName !== "Delete" && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-xl">Amount</Label>
                    <Input
                    className="text-base"
                    id="name"
                    placeholder="e.g. 1"
                    name="flowRate"
                    value={flowRate}
                    onChange={handleFlowRateChange}
                    />
                  </div>
                  )}
                </div>
              </form>
          </CardContent>
          <div className="flex flex-col gap-4">
            {displayFlowrate &&
            <div className="px-[24px]">
              <Alert className="flex justify-between">
                <AlertTitle className="text-bx">
                  {gMonth}</AlertTitle>
                <AlertDescription className="text-bx2">
                  {flowRateDisplay !== "" ? flowRateDisplay : 0}
                </AlertDescription>
              </Alert>
            </div>
            }
            <CardFooter className="flex justify-between gap-4">
              <Button
                variant={`${flowType === 'deleteFlow' ? 'outline' : 'destructive'}`}
                className={
                  flowType === 'deleteFlow'
                    ? 'hover:bg-opacity-100 text-black text-base px-8 py-4'
                    : 'bg-cancelButton hover:bg-cancelButton bg-opacity-80 hover:bg-opacity-100 text-white text-base px-8 py-4'
                }
                onClick={() => {
                  toggleFlow(); // This will handle canceling based on flowType
                  setButtonName('');
                }}
              >
                Cancel
              </Button>
              {isButtonLoading ? (
                <Button disabled className="text-base">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading..
                </Button>
              ) : (
                <Button
                  onClick={handleFlow}
                  className={`${
                    flowType === 'deleteFlow'
                      ? 'bg-cancelButton hover:bg-cancelButton'
                      : 'bg-streamButton hover:bg-streamButton'
                  }  bg-opacity-80 hover:bg-opacity-100 text-white text-base px-8 py-4`}
                >
                  {buttonText}
                </Button>
              )}
            </CardFooter>
          </div>
    </Card>
  );
};

export default InitiateModal;
