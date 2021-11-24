import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Signin from "./View/Authentication/Signin";
import Stations from "./View/Stations";
import Home from "./View/ConnectRoute";
import Register from "./View/Authentication/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/register" component={Register} />
      <ProtectedRoute exact path="/connectRoute" component={Home} />
      <ProtectedRoute exact path="/" component={Stations} />
    </BrowserRouter>
  );
}

export default App;
