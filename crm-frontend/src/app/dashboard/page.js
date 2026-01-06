'use client'

import { useState,useEffect } from 'react'
import styles from './page.module.css'

export default function page() {

    const [user,setUser] = useState({})

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData()
    },[])

    const fetchData = async() => {

        const userData = JSON.parse(localStorage.getItem('user'))

        try {
            const response = await fetch('http://localhost:5000/api/dash',{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token: userData.token}),
                credentials: "include"
            })

            const data = await response.json()

            if(data.success == false){
                setMessage(data.message)
                return
            }

            setMessage(data.message)

            setUser(data.user);
        } 
        catch (error) {
            console.log(error.message);
            setMessage(error.message)
        }
    }

  return (
    <>
        <div className={styles.dashboard}>
            {/* <h2 className={styles.title}>
                Total No of Staff for {user.company} : {user.staffNo}
                <br/>
                Total No of Leads : {user.leadsNo}
            </h2>

            <h5 className={styles.message}>{message}</h5> */}

            <div className={styles.mainbox}>
                <div className={styles.heading}>
                    Welcome {user.company} !!!
                </div>

                <div className={styles.boxes}>
                    <div className={styles.box}>
                        You have {user.staffNo} employees in your company.
                    </div>
                    <div className={styles.box}>
                        Your company has {user.leadsNo} leads.
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
