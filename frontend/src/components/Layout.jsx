import { Outlet } from "react-router-dom"
import { Animate, Footer, Navbar } from "./index"

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Animate>
        <main className="flex-1 flex justify-center h-full">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </Animate>
      <Footer />
    </div>
  )
}