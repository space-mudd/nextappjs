import { TypeAnimation } from "react-type-animation";

interface LoadingType {
  character: string;
}
function LoadingType({ character }: LoadingType) {
  return (
    <TypeAnimation
      sequence={[
        `${character} IS THINKING.`,
        1000,
        `${character} IS THINKING..`,
        1000,
        `${character} IS THINKING...`,
        1000,
      ]}
      cursor={false}
      wrapper="span"
      className="absolute top-2/3 -translate-y-2/3 left-1/2 tracking-widest text-xl -translate-x-1/2 bg-transparent border-none outline-none focus:border-none focus:outline-none text-white z-30 w-1/5"
      speed={50}
      style={{ fontSize: "1em", display: "inline-block" }}
      repeat={Infinity}
    />
  );
}

export default LoadingType;
