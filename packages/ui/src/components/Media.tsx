import React from "react";
import clsx from "clsx";
import { AspectRatio } from "./AspectRatio";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

/**
 * Image component provides styled image tags with fallbacks.
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, fallback, src, alt = "", ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src);

    const handleError = () => {
      if (fallback) setImgSrc(fallback);
    };

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={clsx("rounded-md object-cover w-full h-full", className)}
        {...props}
      />
    );
  }
);
Image.displayName = "Image";

/**
 * AspectImage forces responsive images into predefined aspect ratio frames.
 */
export interface AspectImageProps extends ImageProps {
  ratio?: number;
}

export const AspectImage = React.forwardRef<HTMLImageElement, AspectImageProps>(
  ({ ratio = 16 / 9, className, ...props }, ref) => {
    return (
      <AspectRatio ratio={ratio}>
        <Image ref={ref} className={className} {...props} />
      </AspectRatio>
    );
  }
);
AspectImage.displayName = "AspectImage";

/**
 * Logo represents the standard brand lockup mark.
 */
export const Logo: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> = ({
  size = 32,
  className,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("text-primary", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
};
Logo.displayName = "Logo";
