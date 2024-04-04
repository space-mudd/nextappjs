import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

interface LoadingType {
  character: string;
}

function LoadingType({ character }: LoadingType) {
  // Font boyutunu saklamak için bir state tanımlayın
  const [fontSize, setFontSize] = useState("");

  // Pencere boyutunda bir değişiklik olduğunda çalışacak fonksiyonu tanımlayın
  useEffect(() => {
    function handleResize() {
      // Yeni font boyutunu hesaplayın (ekran yüksekliğinin 12/930'lık bir oranı)
      const newFontSize = `${(window.innerHeight * 18) / 930}px`;
      setFontSize(newFontSize);
    }

    // Pencere boyutu değişikliği dinleyicisini ekleyin
    window.addEventListener("resize", handleResize);

    // İlk yüklemede font boyutunu ayarlayın
    handleResize();

    // Komponent unmount olduğunda dinleyiciyi kaldırın
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Boş bağımlılık dizisi, fonksiyonun sadece bileşen monte edildiğinde çalışmasını sağlar.

  return (
    <div>
      {fontSize ? (
        <TypeAnimation
          sequence={[
            `Stand by - cognitive matrices and mechanical components are synchronizing. Indulge in the short film especially for your enjoyment. Your patience is greatly appreciated.`,
            1000,
          ]}
          cursor={false}
          wrapper="span"
          className="absolute -translate-y-2/3 left-1/2 tracking-wider text-xl -translate-x-1/2 bg-transparent border-none outline-none focus:border-none focus:outline-none text-white z-30 w-1/5"
          speed={50}
          style={{
            top: "calc(238/300 * 100%)",
            fontSize: fontSize,
            height: "calc(12/93 * 100%)",
            overflow: "auto",
            lineHeight: 1.5,
            display: "inline-block",
          }}
          repeat={Infinity}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default LoadingType;
