"user server"

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';

export default async function LinkTo() {
  const session = await getServerSession(authOptions);

  const href = session ? '/pages/upload' : '/pages/signup';

  return (
    <Link
      href={href}
      className="bg-blue-400 hover:bg-blue-700 text-white font-semibold text-xl px-10 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-20"
    >
      Get Started
    </Link>
  );
}
