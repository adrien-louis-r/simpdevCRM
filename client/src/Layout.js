import React from "react";
import Navigation from "./modules/Navigation";
import Styleguide from "./pages/Styleguide";
import Relationships from "./pages/Relationships";
import { Switch, Route } from "react-router-dom";
import NotFound from "./components/NotFound";

function Layout() {
  return (
    <div>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <Styleguide />
        </Route>
        <Route path="/relationships">
          <Relationships />
        </Route>
        <Route exact path="/404">
          <NotFound />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default Layout;
