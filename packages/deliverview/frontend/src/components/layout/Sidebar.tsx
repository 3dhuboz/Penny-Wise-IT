import { NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Home, Video, Package, Users, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/record', icon: Video, label: 'Record' },
  { to: '/handovers', icon: Package, label: 'Handovers' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
        <Package className="h-6 w-6 text-brand" />
        <span className="text-lg font-bold text-brand-dark">DeliverView</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: 'h-9 w-9' },
          }}
        />
      </div>
    </aside>
  );
}
