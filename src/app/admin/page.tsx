// Admin dashboard page
// TODO: Copy content from artifacts

import { useTranslations } from 'next-intl'

export default function AdminPage() {
  const t = useTranslations('nav')

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('dashboard')}
        </h2>
      </div>
      <div className="space-y-4">
        {/* Dashboard content */}
      </div>
    </div>
  )
}
