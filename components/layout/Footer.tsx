import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-light-300 dark:border-dark-700 bg-light-50 dark:bg-dark-900/40">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-600 dark:text-light-400">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src="/easy%20drop.png" alt="EasyDrop logo" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-semibold text-dark-900 dark:text-white">EasyDrop</span>
        </Link>
        <p className="text-center md:text-right w-full md:w-auto text-dark-500 dark:text-light-500">© {year} EasyDrop. All rights reserved.</p>
      </div>
    </footer>
  );
} 