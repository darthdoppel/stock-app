import './index.css'
import TableComponent from './components/Table'
import NavBar from './components/Navbar'

function App () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NavBar />
      <TableComponent />
    </div>
  )
}

export default App
