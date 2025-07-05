import { Outlet } from "react-router-dom"
import { Animate, Footer, Navbar } from "./index"

export default function Layout() {
  return (
    <>
      <Navbar />
      <Animate>
        <main className="flex-1 bg-gray-50 pt-4 sm:pt-6 lg:pt-8">
          <Outlet />
        </main>
      </Animate>
      <Footer />
    </>
  )
}