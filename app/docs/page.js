import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DocsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Docusaurus
    window.location.href = '/docs';
  }, []);

  return <div>Redirecting to documentation...</div>;
}
