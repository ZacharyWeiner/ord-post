import Image from 'next/image'
import { Inter } from 'next/font/google'
import PublishControl from '@/components/Publish.component'
import BalanceControl from '@/components/Balance.component'
import RecentArticlesControl from '@/components/RecentArticles.component'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Publish a blogpost directly to &nbsp;
          <code className="font-mono font-bold">Bitcoin</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <BalanceControl />
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

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {// <a
        //   href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        //   className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        //   target="_blank"
        //   rel="noopener noreferrer"
        // >
        //   <h2 className={`mb-3 text-2xl font-semibold`}>
        //     Docs{' '}
        //     <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        //       -&gt;
        //     </span>
        //   </h2>
        //   <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        //     Find in-depth information about Next.js features and API.
        //   </p>
        // </a>

        // <a
        //   href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        //   className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        //   target="_blank"
        //   rel="noopener noreferrer"
        // >
        //   <h2 className={`mb-3 text-2xl font-semibold`}>
        //     Learn{' '}
        //     <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        //       -&gt;
        //     </span>
        //   </h2>
        //   <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        //     Learn about Next.js in an interactive course with&nbsp;quizzes!
        //   </p>
        // </a>

        // <a
        //   href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        //   className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        //   target="_blank"
        //   rel="noopener noreferrer"
        // >
        //   <h2 className={`mb-3 text-2xl font-semibold`}>
        //     Templates{' '}
        //     <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        //       -&gt;
        //     </span>
        //   </h2>
        //   <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        //     Discover and deploy boilerplate example Next.js&nbsp;projects.
        //   </p>
        // </a>

        // <a
        //   href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        //   className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        //   target="_blank"
        //   rel="noopener noreferrer"
        // >
        //   <h2 className={`mb-3 text-2xl font-semibold`}>
        //     Deploy{' '}
        //     <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        //       -&gt;
        //     </span>
        //   </h2>
        //   <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        //     Instantly deploy your Next.js site to a shareable URL with Vercel.
        //   </p>
        // </a>
        }
      </div>
    </main>
  )
}
