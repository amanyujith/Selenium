import React, { useRef, useEffect, useState } from "react";

interface LazyLoadImageProps {
  src: string;
  alt: string;
  className: string;
}

const LazyLoadImage: React.FC<LazyLoadImageProps> = ({
  src,
  alt,
  className,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <img
      className={className}
      ref={imgRef}
      src={isVisible ? src : ""}
      alt={alt}
    />
  );
};

export default LazyLoadImage;
