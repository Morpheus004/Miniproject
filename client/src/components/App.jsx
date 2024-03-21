import React from "react";
import Login from "./loginpage";
import {Routes , Route} from "react-router-dom"
import FreeComponent from "./FreeComponent";
import SuccessfulLogin from "./SuccessfulLogin";
import ProtectedRoutes from "./ProtectedRoutes";
function App() {
  return (
    // <div className="container">
    //   <Login />
    // </div>

    //changes
    <div className="container">
          {/* <section id="navigation"style={{ position: "fixed", top: 0, width: "100%", background: "lightgray", padding: "10px"}}>
            <a href="/">Home</a>
            <a href="/free">Free Component</a>
            <a href="/auth">Auth Component</a>
          </section> */}
    <Routes>
      <Route exact path="/" element={<Login/>}/>
      <Route exact path="/free" Component={<FreeComponent/>}/>
      <Route element={<ProtectedRoutes/>}>
        <Route path="/auth" element={<SuccessfulLogin/>} exact/>
      </Route>
      {/* <ProtectedRoutes path="/auth" Component={SuccessfulLogin}/> */}
    </Routes>
    </div>

  );
}

export default App;
