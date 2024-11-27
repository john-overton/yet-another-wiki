import { redirect } from 'next/navigation';

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

export default function SlugPage() {
  // Redirect any non-docs routes to home
  redirect('/');
}
