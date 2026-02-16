'use client';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { SidebarContent } from '@/components/dashboard/sidebar-content';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-background">
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarContent />
        </Sidebar>
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
