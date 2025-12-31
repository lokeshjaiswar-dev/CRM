'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css'

export default function page() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async(e) => {

    e.preventDefault();
    setMessage('');

    try{
      const response = await fetch('http://localhost:5000/api/auth/login',{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password}),
        credentials: "include"
      })

      const data = await response.json()

      if(data.success == false){
        setMessage(data.message)
        return
      }

      const user = JSON.stringify(data.user)
      localStorage.setItem('user', user)
      
      setMessage(data.message)

      router.push('/dashboard')
    }
    catch(error){
      console.log("Error: "+error.message);
      setMessage(error.message)
    }

  }

  return (
    <>
      <div className={styles.container}>
          <div className={styles.formBox}>
            <h2 className={styles.title}>Login Form</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
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
                placeholder='Enter your Password'
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.input}
              />

              <input type="submit" value="Login" className={styles.button}/>
            </form>

            <Link href='/register' className={styles.link}>Don't have an account register</Link>

            <h3 className={styles.messageBox}>
              {message}
            </h3>
          </div>
      </div>
    </>
  )
}
