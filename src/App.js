import './App.css'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from './Home'
import ChatRoom from './ChatRoom'
export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/chatroom" component={ChatRoom} />
      </Switch>
    </Router>
  );
}
