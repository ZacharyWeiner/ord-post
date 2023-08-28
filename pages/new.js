import Image from 'next/image'
import { Inter } from 'next/font/google'
import PublishControl from '@/components/Publish.component'
import BalanceControl from '@/components/Balance.component'
import RecentArticlesControl from '@/components/RecentArticles.component'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
    >
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
    <Link href="/"> Home </Link>
      <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        Publish a blogpost directly to &nbsp;
        <code className="font-mono font-bold">Bitcoin</code>
      </p>
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
      </div>
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <div
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        >
          By{' '} <a href='https://twitter.com/developingZack'> DevelopingZack</a> && <a href='https://twitter.com/alexjvidal'> AlexJVidal</a> 
        </div>
      </div>
    </div>
      <div className='w-full'>
        <PublishControl />
      </div>
    </main>
  )
}
