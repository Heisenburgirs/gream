import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import success from "../../public/success.png";
import failed from "../../public/failed.png";

interface Props {
  handleSuccessClose: () => void;
  successMessage: string;
  failedMessage: string;
  flowType: string;
  failedTx: boolean;
}

const SuccessModal: React.FC<Props> = ({handleSuccessClose, successMessage, failedMessage, flowType, failedTx }) => {
  return (
    <Card className="w-[300px] p-4">
      <div className="w-full h-full flex flex-col justify-center items-center py-8 gap-8">
        <div className="flex w-full h-full flex-col justify-center items-center gap-4">
          <Image src={failedTx ? failed : success} width={64} height={64} alt="Stream Created" />
          <div className="text-xl">
            {failedTx ? failedMessage : successMessage}
          </div>
        </div>
        <Button variant="outline" className="text-base px-8 py-4" onClick={handleSuccessClose}>
          Close
        </Button>
      </div>
    </Card>
  );
};

export default SuccessModal;
