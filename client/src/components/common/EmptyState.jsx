// src/components/common/EmptyState.jsx
import { PackageX } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageX, title = 'Nothing here yet', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-sm">{description}</p>}
      {action}
    </div>
  );
}
