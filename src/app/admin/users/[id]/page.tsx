import { UserForm } from '@/components/features/users'

interface UserPageProps {
  params: { id: string }
}

export default function UserPage({ params }: UserPageProps) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">User Details</h1>
      <UserForm userId={params.id} />
    </div>
  )
}
