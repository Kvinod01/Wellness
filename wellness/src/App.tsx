
import { Route, Routes } from 'react-router-dom'
import Pomodoro from './component/Pomodoro/Pomodoro'
const App = () => {
  return (
    <div>
      <Routes>
        
        <Route
          path='/Pomodoro'
          element={
            <Pomodoro />
          }

        />
        <Route path='*' element={<h1>404 : Page Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App