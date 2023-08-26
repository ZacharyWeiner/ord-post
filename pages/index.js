import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import PublishControl from '@/components/Publish.component'
import BalanceControl from '@/components/Balance.component'
import RecentArticlesControl from '@/components/RecentArticles.component'
import TransactionSearchComponent from '@/components/TransactionSearch.component';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>ordpost</title>
        <meta property="twitter:card" content="https://pbs.twimg.com/profile_images/1693010455025840128/sYW3qBAt_400x400.jpg" />
        <meta property="twitter:description" content="News on Bitcoin - Satoshi Vision"></meta>
      </Head>
    <main
      className={`flex flex-col items-center justify-between lg:p-24 h-screen ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Publish a blogpost directly to &nbsp;
          <code className="font-mono font-bold">Bitcoin</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <BalanceControl />
          <div>
          By{' '} <a href='https://twitter.com/developingZack'> DevelopingZack</a> && <a href='https://twitter.com/alexjvidal'> AlexJVidal</a> 
          </div> 
        </div>
      </div>
      <div className='w-full flex pt-24 mb-12'>
        <h1 className="text-4xl mx-auto font-bold">Welcome to Ordpost</h1>
      </div> 
      
      <div className='md:flex w-full'> 
        <div className='w-full lg:max-w-md'>
         
          <div className='w-full flex text-center '>
            <Link
                href="/new-post"
                className="w-full bg-white text-blue-500 p-2 px-10 mx-10 my-4 rounded-md hover:bg-gray-800 transition duration-200 ease-in-out shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '} CREATE A NEW POST {' '}
              </Link>
          </div>
          <p className="w-full text-4xl mx-auto font-bold p-2 px-10 mx-10 my-4" > OR Search By TXID: </p>
          <TransactionSearchComponent />
          
        </div> 
        <div className='mx-auto flex min-h-48 overflow-y-scroll w-full  border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          <RecentArticlesControl />
        </div>
      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      <Link
          href="/new-post"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Post{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clone this projec to run on your own
          </p>
        </Link>
        <a
          href="https://github.com/ZacharyWeiner/ord-post"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://github.com/ZacharyWeiner/ord-post"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn how to publish a blogpost
          </p>
        </a>

        <a
          href="https://github.com/ZacharyWeiner/ord-post"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Clone{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clone this projec to run on your own
          </p>
        </a>
      </div>
    </main>
    </>
  )
}
