import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}

export default function Image({
  src,
  alt = '',
  fill,
  priority,
  className = '',
  style,
  ...props
}: ImageProps) {
  const fillStyles: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{ ...fillStyles, ...style }}
      className={className}
      {...props}
    />
  );
}
