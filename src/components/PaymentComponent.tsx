// components/PayPalButton.js
import React from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
const PaymentComponent = () => {
  const { data: session } = useSession();
  const addCredit = async function () {
    if (session?.user) {
      const res = await fetch("/api/addCredit", {
        method: "POST",
        body: JSON.stringify({ userId: session?.user?.id }),
      });
    }
  };
  React.useEffect(() => {
    const scriptLoaded = setInterval(() => {
      if (window.paypal) {
        clearInterval(scriptLoaded);
        window.paypal
          .HostedButtons({
            hostedButtonId: "LK47HZMJ9ULCA",
            onApprove: (data: any, actions: any) => {
              addCredit();
              console.log("Transaction approved!", data);
            },
            onClick: () => {
              console.log("Button clicked");
            },
          })
          .render("#paypal-container-LK47HZMJ9ULCA");
      }
    }, 500); // Check every 500ms

    return () => clearInterval(scriptLoaded);
  }, []);

  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=BAA93KMHLc6-DecbhTiai1oIwLjx1nyWQupHLk7kqf7Ffd8dcypMFkNyES8LQpF7R1YVknDTuNfFgK1cnI&components=hosted-buttons&enable-funding=venmo&currency=USD"
        onLoad={() => {
          console.log("PayPal Script Loaded");
        }}
      />
      <div id="paypal-container-LK47HZMJ9ULCA"></div>
    </>
  );
};

export default PaymentComponent;
