// ** React Imports
import { Outlet, useLocation } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout"

// ** Menu Items Array
import navigation from "@src/navigation/vertical"
import { useEffect, useState } from "react"

const VerticalLayout = (props) => {
  const location = useLocation()
  const [items,setItems] = useState(navigation)
  // const [menuData, setMenuData] = useState([])
  useEffect(()=>{
      let activeItem = (localStorage.getItem('active_doc'))
      console.log(activeItem,'active')
      let temp = [...items]
      let idx = temp.findIndex(i => i.title =='Dashboard')
      if(idx!=-1){
        if(!activeItem){
          delete temp[idx].children
        }else{
          temp[idx].children = [{title:activeItem, parent: 'home', navLink:""}]
        }
        setItems([...temp])
      }
      
  },[location])
  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={items} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
