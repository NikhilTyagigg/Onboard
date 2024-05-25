// ** React Imports
import { Fragment } from "react"

// ** Custom Components
import NavbarUser from "./NavbarUser"
//import NavbarSearch from './NavbarSearch'

// ** Third Party Components
import { Sun, Moon, Menu } from "react-feather"

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap"

import { Link } from 'react-router-dom';

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />
    }
  }

  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center" style={{width: '50%', float: 'left'}}>
      <ul className="navbar-nav d-xl-none">
        <NavItem className="mobile-menu me-auto">
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs is-active"
            onClick={() => setMenuVisibility(true)}
          >
            <Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <NavItem className="d-none d-lg-block">
        <NavLink className="nav-link-style">
          <Link to="/">
            {/*<img src={'/assets/images/logo/logoColor.png'} style={{width: '172.65px'}} ></img>*/}
          </Link>
        </NavLink>
      </NavItem>
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
