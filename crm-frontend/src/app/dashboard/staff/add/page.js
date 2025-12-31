'use client'

import { useState } from "react"
import styles from './page.module.css'
import {useRouter} from 'next/navigation'

export default function LoginPage() {

    const router = useRouter()

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [phone, setPhone] = useState("")

    const [message,setMessage] = useState("")


    const handleSubmit = async(e) => {

      const userData = JSON.parse(localStorage.getItem("user"))
      
      e.preventDefault();
      setMessage("");

      try {
        const response = await fetch("http://localhost:5000/api/staff/add",{
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({fname, lname, email, role, phone, token: userData.token })
        });

        const data = await response.json()

        if(data.success == false){
          setMessage(data.message)
          return
        }

        setMessage(data.message);

        router.push('/dashboard/staff')

      } 
      catch (error) {
        console.log("error: "+error.message);
        setMessage(error.message)        
      }
    }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Add Staff</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="text"
                placeholder='Enter First Name'
                required
                value={fname}
                onChange={e => setFname(e.target.value)}
                className={styles.input}
               />

              <input 
                type="text"
                placeholder='Enter Last Name'
                required
                value={lname}
                onChange={e => setLname(e.target.value)}
                className={styles.input}
               />

              <input 
                type="email"
                placeholder='Enter Email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
               />

              <input 
                type="text"
                placeholder='Enter Phone Number'
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={styles.input}
              />

              <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className={styles.select}
                  required
              >
                  <option value="">Select Role</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
              </select>

              <input type="submit" value="Add Staff" className={styles.button}/>
          </form>

          <h4 className={styles.message}>{message}</h4>
        </div>
      </div>
    </>
  )
}
