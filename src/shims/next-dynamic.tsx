import React, { Suspense } from 'react';

export default function dynamic<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T } | T>,
  options?: { ssr?: boolean; loading?: () => React.ReactNode }
) {
  const LazyComponent = React.lazy(async () => {
    const mod = await importer();
    return (mod as any).default ? (mod as any) : { default: mod as any };
  });

  return function DynamicWrapper(props: any) {
    return (
      <Suspense fallback={options?.loading ? options.loading() : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
