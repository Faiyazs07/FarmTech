'use client';

import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 pb-16 lg:pb-0 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
