'use client'

import { useRouter } from "next/navigation"
import { useEffect,useState } from "react"
import styles from './page.module.css'

export default function MasterPage() {

    const router = useRouter()
    const [user,setUser] = useState(null)
    const [message, setMessage] = useState("")
    const [data, setData] = useState([])

    useEffect(() => {
        const userFromLocal = JSON.parse(localStorage.getItem("user"))

        if(userFromLocal.role != "owner"){
            router.push('/dashboard')
            return
        }
        setUser(userFromLocal)

        fetchType(userFromLocal.token)
    }, [router])

    const fetchType = async(token) => {
      setMessage("")

      try {
        const response = await fetch("http://localhost:5000/api/master/all",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({token}),
          credentials: "include"
        })

        const types = await response.json()

        if(types.success == false){
          setMessage(types.message)
          return
        }

        console.log(types.data);
        
        setData(types.data)
        setMessage(types.message)

        // console.log(data, message);
        
      } catch (error) {
        console.log("ERROR : ",error.message);
        setMessage(error.message)
      }
    }

    const addType = async() => {
      setMessage("")

      try {
        const response = await fetch("http://localhost:5000/api/master/add",{
          method:"POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({lead_name,description}),
          credentials: "include"
        })

        const data = await response.json()

        if(data.success == false){
          setMessage(data.message)
          return
        }

        setMessage(data.message)

      } 
      catch (error) {
        console.log("ERROR : "+error.message);
        setMessage(error.message)
      }
    }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
            <div className={styles.databox}>
              <div className={styles.header}>
                <div className={styles.title}>
                  Type Of Leads
                </div>
                <div className={styles.button}>
                  <button>Add Type</button>
                </div>
              </div>

              <div className={styles.tablebox}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Lead Type</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                    <tbody>
                      {
                        data.map(type => (
                          <tr key={type.id}>
                            <td>{type.id}</td>
                            <td>{type.type_name}</td>
                            <td>{type.description}</td>
                            <td>
                              <button>Update</button>
                              <button >Delete</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}
