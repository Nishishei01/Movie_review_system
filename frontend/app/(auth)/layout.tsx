// import { Nunito } from "next/font/google";

import AuthProvider from "@/utils/authProvider"

// const nuntio = Nunito({
//   subsets: ['latin']
// })

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en" className={nuntio.className}>
      <>
      <AuthProvider mode="public">
        {children}
      </AuthProvider>
      </>
    // </html>
  )
}
