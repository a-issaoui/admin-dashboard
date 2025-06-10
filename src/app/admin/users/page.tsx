import { UsersTable } from '@/components/features/users'

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      <UsersTable />
    </div>
  )
}
