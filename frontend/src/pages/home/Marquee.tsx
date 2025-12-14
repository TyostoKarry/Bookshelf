import { type PropsWithChildren, type FC, type CSSProperties } from "react";

type MarqueeProps = {
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
};

export const Marquee: FC<PropsWithChildren<MarqueeProps>> = ({
  children,
  speed = 30,
  pauseOnHover = true,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={
        {
          "--marquee-duration": `${speed}s`,
        } as CSSProperties
      }
    >
      <div
        className={`flex w-max shrink-0 animate-marquee [animation-duration:var(--marquee-duration)] ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {children}
        {children}
      </div>
    </div>
  );
};
