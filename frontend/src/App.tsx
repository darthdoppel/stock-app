import './index.css'
import TableComponent from './components/Table'
import NavBar from './components/Navbar'
import AddAccessoryModal from './components/AddAccessoryModal'
import { Toaster } from 'sonner'

function App () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NavBar />
      <Toaster richColors />
      <div className="p-4 mt-20">
        <AddAccessoryModal />
      </div>
      <TableComponent />
    </div>
  )
}

export default App
