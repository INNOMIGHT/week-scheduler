import logo from './logo.svg';
import './App.css';
import { Calendar } from 'react-big-calendar';
import MyCalendar from './components/Calendar';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <MyCalendar />
    </div>
  );
}

export default App;
