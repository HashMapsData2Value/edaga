import { useTheme } from "@/ThemeProvider";
import { useEffect, useState } from "react";
import { ReactSVG as SVG } from "react-svg";

interface SvgIconProps {
  icon: string;
  size?: number;
  foreground?: string; // Optional to allow overriding
  background?: string;
  className?: string;
}

const SvgIcon = ({
  icon,
  size = 40,
  foreground, // Accept foreground prop for potential override
  background,
  className,
}: SvgIconProps) => {
  const { theme } = useTheme();
  const [themeForegroundColor, setThemeForegroundColor] = useState("#000000");

  useEffect(() => {
    if (theme === "dark") {
      setThemeForegroundColor("#ffffff");
    } else if (theme === "light") {
      setThemeForegroundColor("#000000");
    } else if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeForegroundColor(systemPrefersDark ? "#ffffff" : "#000000");
    }
  }, [theme]);

  const effectiveForegroundColor = foreground || themeForegroundColor;

  return (
    <SVG
      src={icon}
      beforeInjection={(svg) => {
        svg.setAttribute("style", `width: ${size}px; height: ${size}px;`);

        const elementsToColor = svg.querySelectorAll(
          "path, circle, rect, polygon, polyline, line, ellipse"
        );

        elementsToColor.forEach((element, index) => {
          if (element.tagName === "rect" && index === 0) {
            element.setAttribute("fill", background || "none");
          } else {
            element.setAttribute("fill", effectiveForegroundColor);
            // element.setAttribute("stroke", effectiveForegroundColor);
          }
        });
      }}
      className={className ? `${className}` : ""}
    />
  );
};

export default SvgIcon;
