import { FC } from "react";

interface SVGIconProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
}

const Algorand: FC<SVGIconProps> = ({
  width = 240,
  height = 240,
  fill = "currentColor",
  className = "",
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M239.18 239.32H201.81L177.54 149.04L125.36 239.33H83.64L164.29 99.57L151.31 51.05L42.56 239.36H0.820007L138.64 0.639999H175.18L191.18 59.95H228.88L203.14 104.71L239.18 239.32Z"
        fill={fill}
      />
    </svg>
  );
};

export default Algorand;
