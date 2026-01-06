'use client'

import Link from "next/link"
import { useState } from "react"
import styles from './page.module.css'
import { useRouter } from "next/navigation"

export default function LoginPage() {

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [phone, setPhone] = useState("")
    const [company_name, setCompany_Name] = useState("")

    const [message,setMessage] = useState("")
    const router = useRouter()


    const handleSubmit = async(e) => {

      e.preventDefault();
      setMessage("");

      try {
        const response = await fetch("http://localhost:5000/api/auth/register",{
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({fname, lname, email, password, cpassword, phone, company_name})
        });

        const data = await response.json()

        if(data.success == false){
          setMessage(data.message)
          return
        }

        setMessage(data.message);

        router.push("/")
        
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
          <h1 className={styles.title}>Registeration Form</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="text"
                placeholder='Enter your First Name'
                required
                value={fname}
                onChange={e => setFname(e.target.value)}
                className={styles.input}
               />

              <input 
                type="text"
                placeholder='Enter your Last Name'
                required
                value={lname}
                onChange={e => setLname(e.target.value)}
                className={styles.input}
               />

              <input 
                type="email"
                placeholder='Enter your Email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
               />

              <input 
                type="password"
                placeholder='Set a password'
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
               />

              <input 
                type="password"
                placeholder='Confirm Password'
                required
                value={cpassword}
                onChange={e => setCpassword(e.target.value)}
                className={styles.input}
               />

              <input 
                type="text"
                placeholder='Enter your Phone Number'
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={styles.input}
              />

              <input 
                type="text"
                placeholder='Enter your Company name'
                required
                value={company_name}
                onChange={e => setCompany_Name(e.target.value)}
                className={styles.input}
               />

              <input type="submit" value="Register" className={styles.button}/>
          </form>

          <Link href='/' className={styles.link}>Already have an account ? </Link>

          <h4 className={styles.message}>{message}</h4>
        </div>
      </div>
    </>
  )
}
