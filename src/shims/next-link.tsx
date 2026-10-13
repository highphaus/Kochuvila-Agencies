import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface NextLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string | { pathname?: string; query?: Record<string, string> };
  children?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

export default function Link({ href, children, ...props }: NextLinkProps) {
  let to = '/';
  if (typeof href === 'string') {
    to = href;
  } else if (href && typeof href === 'object') {
    to = href.pathname || '/';
    if (href.query) {
      const q = new URLSearchParams(href.query).toString();
      if (q) to += `?${q}`;
    }
  }

  // Handle external links or tel/mailto/whatsapp
  if (to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:') || to.startsWith('https://wa.me')) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
}
