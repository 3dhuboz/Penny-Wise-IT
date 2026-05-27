import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/record': 'Record',
  '/handovers': 'Handovers',
  '/clients': 'Clients',
  '/settings': 'Settings',
};

export function Header() {
  const { pathname } = useLocation();

  let title = titles[pathname];
  if (!title && pathname.startsWith('/handovers/')) title = 'Handover Detail';
  if (!title) title = 'DeliverView';

  return (
    <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
    </header>
  );
}
