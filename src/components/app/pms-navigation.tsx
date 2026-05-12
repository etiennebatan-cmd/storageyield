'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PmsNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  const links = [
    { href: '/app/control-room', label: 'Control Room', icon: '📊' },
    { href: '/app/customers', label: 'Customers', icon: '👥' },
    { href: '/app/tenancies', label: 'Tenancies', icon: '🏠' },
    { href: '/app/contracts', label: 'Contracts', icon: '📋' },
    { href: '/app/billing', label: 'Billing', icon: '💰' },
    { href: '/app/access', label: 'Access', icon: '🔐' },
    { href: '/app/tasks', label: 'Tasks', icon: '✓' },
    { href: '/app/maintenance', label: 'Maintenance', icon: '🔧' },
    { href: '/app/support', label: 'Support', icon: '📞' },
    { href: '/app/acquisition', label: 'Acquisition', icon: '🎯' },
    { href: '/app/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto pb-4 text-sm border-b">
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 rounded whitespace-nowrap ${
            isActive(href)
              ? 'bg-blue-100 text-blue-900 font-semibold'
              : 'hover:bg-gray-100'
          }`}
        >
          {icon} {label}
        </Link>
      ))}
    </nav>
  );
}
