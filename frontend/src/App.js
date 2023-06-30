import './App.css';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Login from './pages/Login';
import Register from './pages/Register';
import EditExp from './pages/EditExp';
import EditInc from './pages/EditInc';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/income' element={<Income />} />
        <Route path='/income/edit/:id' element={<EditInc />} />
        <Route path='/expense' element={<Expense />} />
        <Route path='/expense/edit/:id' element={<EditExp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
