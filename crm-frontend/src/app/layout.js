import { Inter, Roboto, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  "title": "CRM"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>{children}</body>
    </html>
  )
}