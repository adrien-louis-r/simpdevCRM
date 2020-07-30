import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import Contacts from "./Contacts";
import Relationships from "./Relationships";

function Header({ toggle }) {
  return (
    <header className="flex items-center justify-between flex-wrap bg-orange-500 p-6">
      <div className="block lg:hidden ml-auto">
        <button
          onClick={toggle}
          className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-blue-500 hover:border-blue-500"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function Navigation({ open }) {
  const className =
    "p-6 transition duration-200 ease-in-out lg:translate-x-0 transform block inset-0 fixed justify-between w-64 shadow-xl bg-white";
  return (
    <div className={open ? className : `${className} -translate-x-full`}>
      <div className="flex items-center flex-shrink-0 text-orange-500 mr-6">
        <svg
          className="fill-current h-8 w-8"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight ml-2">
          Pouet CRM
        </span>
      </div>
      <nav className="flex flex-col py-6">
        <div>
          <Link
            to="/relationships"
            className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-4"
          >
            Relationships
          </Link>
        </div>
        <div>
          <Link
            to="/contacts"
            className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-4"
          >
            Contacts
          </Link>
        </div>
      </nav>
    </div>
  );
}

function Layout() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div>
      <Navigation open={open} />
      <div onClick={open ? toggle : () => {}} className="lg:ml-64 min-h-screen">
        <Header toggle={toggle} />
        <main className="p-6">
          <Switch>
            <Route exact path="/">
              <div>Hello</div>
            </Route>
            <Route path="/contacts">
              <Contacts />
            </Route>
            <Route path="/relationships">
              <Relationships />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default Layout;
