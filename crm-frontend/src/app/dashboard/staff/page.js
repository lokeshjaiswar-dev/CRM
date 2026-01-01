'use client'

import { useEffect, useState } from "react"
import styles from './page.module.css'
import { useRouter } from "next/navigation"

export default function Staff() {

    const router = useRouter();
    const [users, setUsers] = useState([
        // {id: 1, fname: "Lokesh", lname: "Jaiswar", email: "lokesh@gmail.com", phone: "1234567890", role: "manager"},
        // {id: 2, fname: "Lokesh", lname: "Jaiswar", email: "lokesh@gmail.com", phone: "1234567890", role: "manager"},
        // {id: 3, fname: "Lokesh", lname: "Jaiswar", email: "lokesh@gmail.com", phone: "1234567890", role: "manager"},
        // {id: 4, fname: "Lokesh", lname: "Jaiswar", email: "lokesh@gmail.com", phone: "1234567890", role: "manager"}
    ])
    const [message, setMessage] = useState("");
    
    const fetchUsers = async() => {

        const userData = JSON.parse(localStorage.getItem("user"))

        try {
            setMessage("");
    
            const response = await fetch('http://localhost:5000/api/staff/all',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
    
            setUsers(data.user)
        } 
        catch (error) {
            console.log(error.message);
            setMessage(error.message)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

  return (
    <>
        <div className={styles.container}>
            <div className={styles.staffBox}>
                <div className={styles.staffHeader}>
                    <h1 className={styles.title}>Staff Dashboard</h1>
                    <button onClick={() => router.push('/dashboard/staff/add')}className={styles.button}> Add Staff</button>
                </div>

                <div className={styles.staffTable}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                {/* password backend se by default set kar denge jo ki badmai user change kar sakta hai login hone ke baad (user123)*/} 
                                <th>Contact</th>
                                <th>Role</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.fname}</td>
                                        <td>{user.lname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                </div>
            </div>
            {/* <h5 className={styles.message}>{message} Lokesh</h5> */}
        </div>
    </>
  )
}
