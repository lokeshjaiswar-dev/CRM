'use client'

import styles from "./page.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function layout({children}) {

  const router = useRouter()

  const [user,setUser] = useState({})

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
  const userFromLocal = JSON.parse(localStorage.getItem("user"))
  
  if(!userFromLocal){
    router.push('/')  
    return
  }
  
  setUser(userFromLocal)
  console.log("User mil gaya:", userFromLocal)
}, [router])


  return (
    <>
        <div className={styles.navbar}>

          {
            user.role != "owner" ? (
              <>
                <div className={styles.linkSection}>
                    <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                    <Link href="/dashboard/staff" className={styles.link}> Staff Management</Link>
                    <Link href="/dashboard/lead" className={styles.link}> Lead Management</Link>
                </div>
              </>
            ) : (
              <>
                <div className={styles.linkSection}>
                    <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                    <Link href="/dashboard/staff" className={styles.link}> Staff Management</Link>
                    <Link href="/dashboard/lead" className={styles.link}> Lead Management</Link>
                    <Link href="/dashboard/master" className={styles.link}> Master Management</Link>
                </div>
              </>
            )
          }

          <div>
            <Link className={styles.logout} href='/dashboard/profile'>Profile</Link>
            <button onClick={handLogout} className={styles.logout}>Logout</button>
          </div>
        </div>

        {children}

    </>
  )
}
