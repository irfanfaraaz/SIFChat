import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Dashboard',
  description: 'Chat window layout',
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className=" p-8">
        <div className=" ">
          <aside className=""></aside>
          <div className="flex-1 ">{children}</div>
        </div>
      </div>
    </>
  );
}
