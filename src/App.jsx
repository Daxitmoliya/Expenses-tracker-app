import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Layout from './components/Layout/Layout'
import Expenses from './components/Expenses/Expenses'
import Users from './components/Users/Users'


function App() {
 

  return (
    <>
      <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/users" element={<Users />} />
        
      </Routes>
      </Layout>
    </>
  )
}

export default App
