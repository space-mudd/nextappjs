import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface BuyCreditInterface {
  showBuyCredit: any;
  setShowBuyCredit: any;
}
function BuyCredit({ showBuyCredit, setShowBuyCredit }: BuyCreditInterface) {
  return (
    <div>
      <Dialog open={showBuyCredit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="tracking-wide">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>
              <p>You can buy credits here.</p>
              <Button>Buy Credit</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BuyCredit;
