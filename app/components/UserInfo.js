'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UserInfo = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div className="flex items-center">
        <img
          src={session.user.avatar || 'https://www.gravatar.com/avatar/?d=mp'}
          alt={session.user.name}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span>{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Login
    </button>
  );
};

export default UserInfo;
