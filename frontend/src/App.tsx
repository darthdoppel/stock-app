import './index.css'
import TableComponent from './components/Table'
import SalesTable from './components/SalesTable'
import NavBar from './components/Navbar'
import AddAccessoryModal from './components/AddAccessoryModal'
import { Toaster } from 'sonner'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

function Content () {
  const location = useLocation()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <NavBar />
      <Toaster richColors />
      <div className="p-4 mt-20">
        {location.pathname === '/' && (
          <div className="flex justify-end w-full"> {/* Alinea a la derecha */}
            <AddAccessoryModal />
          </div>
        )}
      </div>
      <Routes>
        <Route path="/sales" element={<SalesTable />} />
        <Route path="/" element={<TableComponent />} />
      </Routes>
    </div>
  )
}

function App () {
  return (
    <Router>
      <Content />
    </Router>
  )
}

export default App
