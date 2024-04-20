/* eslint-disable react/jsx-no-undef */
import React from 'react'
import {HashRouter,Routes,Route} from 'react-router-dom'
import Login from './Pages/Login'
import Sidebar from './Pages/Sidebar'
import Signupteacher from './Pages/Signupteacher'
import Header from './Pages/Header'
import Addcts from './Pages/Addcts'
import Newsandannc from './Pages/Newsandannc'
import Allcourses from './Pages/Allcourses'
import Upcomeing from './Pages/Upcomeing'
import Viewcourses from './Pages/Viewcourses'
import Signupstudent from './Pages/Signupstudent'
import Setting from './Pages/Setting'
import Students from './Pages/Students'
// import Chat from './Pages/Chats'
import Assignment from './Pages/Assignment'
import TeacherQuizForm from './Pages/TeacherQuizForm'
import StudentQuizList from './Pages/StudentQuizList'
import QuizForm from './Pages/QuzForm'
import './App.css'
import TeacherUpload from './Pages/TeacherUpload'
import StudentUpload from './Pages/StudentUpload'
import UploadForm from './Pages/UploadForm'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/Signupteacher' element={<Signupteacher/>}></Route>
        <Route path='/Signupstudent' element={<Signupstudent/>}></Route>
        <Route path='/Sidebar' element={<Sidebar/>}></Route>
        <Route path='/Header' element={<Header/>}></Route>
        <Route path='/Addcts' element={<Addcts/>}></Route>
        <Route path='/Newsandannc' element={<Newsandannc/>}></Route>
        <Route path='/Allcourses' element={<Allcourses/>}></Route>
        <Route path='/Upcomeing' element={<Upcomeing/>}></Route>
        <Route path='/Viewcourses' element={<Viewcourses/>}></Route>
        <Route path='/Setting' element={<Setting/>}></Route>
        {/* <Route path='/Chat' element={<Chat/>}></Route> */}
        <Route path='/Assignment' element={<Assignment/>}></Route>
        <Route path='/Students' element={<Students/>}></Route>
        <Route path='/QuizForm' element={<QuizForm/>}></Route>
        <Route path='/TeacherQuizForm' element={<TeacherQuizForm/>}></Route>
        <Route path='/StudentQuzList' element={<StudentQuizList/>}></Route>
        <Route path='/TeacherUpload' element={<TeacherUpload/>}></Route>
        <Route path='/StudentUpload' element={<StudentUpload/>}></Route>
        <Route path='/UploadForm' element={<UploadForm/>}></Route>

      </Routes>
    </HashRouter>
  )
}

export default App