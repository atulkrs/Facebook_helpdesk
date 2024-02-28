import { Route,Routes } from "react-router";
import SignUpForm from "./component/Register";
import ConnectPage from "./component/Facebook";
import LoginScreen from "./component/Login";
import Messenger from "./component/Messenger";
function App() {
  return (
   <>
     <Routes>
        <Route path="/register" element={<SignUpForm></SignUpForm>}></Route>
        <Route  path="/" element={<LoginScreen></LoginScreen>}></Route>
        <Route  path="/home" element={<ConnectPage></ConnectPage>}></Route>
        <Route path="/messenger" element={<Messenger></Messenger>}></Route>
      </Routes>
   </>
  );
}

export default App;
