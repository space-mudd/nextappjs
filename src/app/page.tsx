"use client";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import LoadingType from "@/components/LoadingType";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { videos } from "../../videos";
export default function Home() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [inputText, setInputText] = useState("");
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoKey, setVideoKey] = useState(Date.now()); // Initial key
  const [creditCount, setCreditCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState("");
  const videoRef = useRef(null);
  const [character, setCharacter] = useState("");
  //https://storage.googleapis.com/childrenstory-bucket/KAI30_small.mp4
  //"https://storage.googleapis.com/childrenstory-bucket/AVA30_GLITCH2.mp4"
  const kaiVideoUrl =
    "https://storage.googleapis.com/childrenstory-bucket/KAI30_small.mp4";
  const avaVideoUrl =
    "https://storage.googleapis.com/childrenstory-bucket/AVA30_GLITCH2.mp4";
  useEffect(() => {
    setCharacter(Math.floor(Math.random() * 2) + 1 === 1 ? "AVA" : "KAI");

    function handleResize() {
      const newFontSize = `${(window.innerHeight * 35) / 930}px`;
      setFontSize(newFontSize);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log(character);
    if (character === "KAI") {
      setVideoUrl(kaiVideoUrl);
    } else if (character === "AVA") {
      setVideoUrl(avaVideoUrl);
    }
  }, [character]);

  useEffect(() => {
    setTimeout(() => {
      setVideoMuted(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setVideoUrl(videos[Math.floor(Math.random() * 4)]);
    }
  }, [isLoading]);

  useEffect(() => {
    if (videoUrl) {
      console.log("url: " + videoUrl);
      setVideoKey(Date.now());
    }
  }, [videoUrl]);
  const handleClick = async function () {
    setIsLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ inputText: inputText, character: character }),
    });
    const text = await res.text();
    setIsLoading(false);
    setVideoUrl(text);
  };

  const useCredit = async function () {
    const res = await fetch("/api/useCredit", {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      const remainingCredits = data.remainingCredits;
      setCreditCount(remainingCredits);
    } else {
      console.error("Error using credit:", res.status);
    }
  };
  const handleSubmit = async () => {
    if (creditCount > 0) {
      //await useCredit();
      setCreditCount(creditCount - 1);
      await handleClick();
      setInputText("");
    }
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  };
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize(); // Get the initial screen width
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleVideoEnd = () => {
    if (character === "AVA") {
      setVideoUrl(avaVideoUrl);
    } else if (character === "KAI") {
      setVideoUrl(kaiVideoUrl);
    }
  };

  const dbHandle = async function () {
    const res = await fetch("/api/addUser", {
      method: "POST",
      body: JSON.stringify({}),
    });
    console.log("ok");
  };

  return (
    <div className="relative bg-black h-screen w-full">
      <button
        className="absolute z-20 bg-transparent text-transparent top-0"
        style={{
          width: "calc(1/18 * 100%)",
          top: "calc(115/400 * 100%)",
          right: "calc(106/400 * 100%)",
        }}
        onClick={() => {
          setCreditCount(creditCount + 1);
        }}
      >
        token
      </button>
      <div className="relative w-full h-screen">
        {!isLoading ? (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="ASK A QUESTION"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              style={{
                height: "calc(1/9 * 100%)",
                top: "calc(215/300 * 100%)",
                left: "calc(118/300 * 100%)",
                width: "calc(22/100 * 100%)",
              }}
              className="absolute top-3/4 -translate-y-2/3 tracking-widest text-xl bg-transparent border-none outline-none focus:border-none focus:outline-none text-white z-30 resize-none overflow-hidden"
            />
          </form>
        ) : (
          <LoadingType character={character} />
        )}
        <LazyLoadImage
          className="z-10 absolute top-0 left-0 w-full h-full"
          src="/FINAL_SPACESHIP_SCREEN4.png"
          alt="background"
        />

        <div
          className="z-0 absolute left-1/2 -translate-x-1/2 flex justify-center h-1/3 aspect-[16/9]"
          style={{ top: "calc(1/8 * 100%)" }}
        >
          <video
            ref={videoRef}
            key={videoKey}
            muted={videoMuted}
            className={`h-full w-full`}
            autoPlay
            playsInline
            loop={videoUrl === avaVideoUrl || videoUrl === kaiVideoUrl}
            preload="none"
            onEnded={handleVideoEnd}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div>
        {fontSize ? (
          <p
            className="z-20 absolute flex justify-center mb-8 text-red-600"
            style={{
              right: "calc(405 / 1400 * 100%)",
              top: "calc(95/700 * 100%)",
              fontSize: fontSize,
            }}
          >
            {creditCount}
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
/*

*/
