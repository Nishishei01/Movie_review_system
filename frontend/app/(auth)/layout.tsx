// import { Nunito } from "next/font/google";

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
      {children}
      </>
    // </html>
  )
}
