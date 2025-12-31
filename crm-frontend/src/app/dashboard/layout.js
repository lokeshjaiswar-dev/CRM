'use client'

import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function layout({children}) {

  const router = useRouter()

  const handLogout = () => {
    // localStorage and sessionStorage have clear()
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear common cookies
    document.cookie = "token=; expires=Wed, 01 Jan 2025 00:00:00 UTC; path=/;"
    document.cookie = "session=; expires=Wed, 01 Jan 2025 00:00:00 UTC; path=/;"
    document.cookie = "auth=; expires=Wed, 01 Jan 2025 00:00:00 UTC; path=/;"

    router.push('/')
  }

  useEffect(() => { 
    const user = localStorage.getItem("user")
    if(!user){
      router.push('/')
    }
  },[])


  return (
    <>
        <div className={styles.navbar}>
            <div className={styles.linkSection}>
                <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                <Link href="/dashboard/staff" className={styles.link}> Staff Management</Link>
                <Link href="/dashboard/lead" className={styles.link}> Lead Management</Link>
            </div>

            <Link className={styles.profile} href='/dashboard/profile'>Profile</Link>
            <button onClick={handLogout} className={styles.profile}>Logout</button>
        </div>

        {children}

    </>
  )
}
