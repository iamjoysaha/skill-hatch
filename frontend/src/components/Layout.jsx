import { Outlet } from "react-router-dom"
import { Animate, Footer, Navbar } from "./index"

export default function Layout() {
  return (
    <>
      <Navbar />
      <Animate>
        <main className="flex-1 bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </Animate>
      <Footer />
    </>
  )
}