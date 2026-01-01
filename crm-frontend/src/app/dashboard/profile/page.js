'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'


export default function Profile() {

    const [user,setUser] = useState({})
    const [message,setMessage] = useState("")

    const fetchData = async() => {

        const userData = JSON.parse(localStorage.getItem("user"))

        try {
            const response = await fetch('http://localhost:5000/api/auth/me',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"token": userData.token}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                setMessage(data.message)
                return
            }

            setMessage(data.message)

            // console.log(data.user);
            
            // const user = JSON.parse(data.user)
            // setUser(user)
            setUser(data.user);

        }
        catch (error) {
            console.log("error: "+error.message);
            setMessage(error.message)
        }
    }

    useEffect(() => {
        fetchData()
    },[])

  return (
    <>
        <div className={styles.container}>
                <div className={styles.formBox}>
                    <h1 className={styles.title}>Profile Card</h1>
                    <label className={styles.input}>First Name : {user.fname}</label>
                    <label className={styles.input}>Last Name : {user.lname}</label>
                    <label className={styles.input}>Email : {user.email}</label>
                    <label className={styles.input}>Company : {user.company_name}</label>
                    <label className={styles.input}>Phone No : {user.phone}</label>
                <div className={styles.buttonBox}>
                    <Link href='/dashboard/profile/updatePassword' className={styles.button}>Update Password</Link>

                    <Link href='/dashboard/profile/updateUser' className={styles.button}>Update User</Link>
                </div>
                </div>
        </div>
    </>
  )
}
