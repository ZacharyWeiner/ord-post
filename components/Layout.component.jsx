import Menu from '@/components/tailwind/Menu.component'
// import Footer from './footer'
 
export default function Layout({ children }) {
  return (
    <>
        <main className={`lg:flex lg:flex-col items-center justify-between max-h-screen `} >
            <Menu />
            <div className='pt-12'> {children}</div>
        </main>
    </>
  )
}