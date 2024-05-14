import React, { useEffect, useState } from "react";

interface PaymentProps {
  isScriptLoaded: boolean;
  setIsScriptLoaded: any;
}
const PaymentComponent = ({
  isScriptLoaded,
  setIsScriptLoaded,
}: PaymentProps) => {
  const addPaypalScript = () => {
    if (window.paypal) {
      setIsScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=BAA93KMHLc6-DecbhTiai1oIwLjx1nyWQupHLk7kqf7Ffd8dcypMFkNyES8LQpF7R1YVknDTuNfFgK1cnI&components=hosted-buttons&enable-funding=venmo&currency=USD";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      window.paypal
        .HostedButtons({
          hostedButtonId: "CT34Y9DUCK63E",
        })
        .render("#paypal-container");
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    addPaypalScript();
  }, []);

  return (
    <div>
      {isScriptLoaded ? <div id="paypal-container"></div> : <p>Loading...</p>}
    </div>
  );
};

export default PaymentComponent;
