import type { Metadata } from 'next';
import { HabitOSProvider } from '@/lib/habitos-context';

export const metadata: Metadata = {
  title: 'HabitOS — Build Better Routines',
  description: 'Track your daily habits, build streaks, and improve your life one day at a time.',
};

export default function HabitOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HabitOSProvider>
      <div className="bg-gray-50 min-h-screen">
        {children}
      </div>
    </HabitOSProvider>
  );
}
