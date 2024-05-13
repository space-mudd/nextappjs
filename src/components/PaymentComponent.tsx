"use client";
import Script from "next/script";
import { useSession } from "next-auth/react";

function PaymentComponent() {
  const { data: session } = useSession();

  const addCredit = async function () {
    if (session?.user) {
      try {
        const res = await fetch("/api/addCredit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session.user.id }),
        });
        if (!res.ok) {
          console.error("Failed to add credit");
        } else {
          console.log("Credit added successfully");
        }
      } catch (error) {
        console.error("Error adding credit:", error);
      }
    }
  };

  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=BAA93KMHLc6-DecbhTiai1oIwLjx1nyWQupHLk7kqf7Ffd8dcypMFkNyES8LQpF7R1YVknDTuNfFgK1cnI&components=hosted-buttons&enable-funding=venmo&currency=USD"
        onLoad={() => {
          if (window.paypal) {
            try {
              window.paypal
                .HostedButtons({
                  hostedButtonId: "LK47HZMJ9ULCA",
                  onApprove: async (data: any, actions: any) => {
                    try {
                      const details = await actions.order.capture();
                      console.log("Payment successful:", details);
                      await addCredit();
                    } catch (error) {
                      console.error("Error capturing order:", error);
                    }
                  },
                })
                .render("#paypal-container-LK47HZMJ9ULCA");
            } catch (error) {
              console.error("Error initializing PayPal buttons:", error);
            }
          }
        }}
      />
      <div className="overflow-auto" id="paypal-container-LK47HZMJ9ULCA"></div>
    </>
  );
}

export default PaymentComponent;
