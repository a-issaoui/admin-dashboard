// Home page - redirects to admin
// TODO: Copy content from artifacts

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/admin')
}
