// ** React Imports
import { Fragment, lazy } from "react"
import { Navigate } from "react-router-dom"
import {
  PrivateRoutes,
  PublicRoutes,
  AllRoutes} from '../../utility/auth/Routes.js'
// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"
// **Components import
import Login from "../../views/Login/index"
import Register from "../../views/Register"
import PublicRoute from "@components/routes/PublicRoute"
import { isObjEmpty } from "@utils"
import { isAdmin } from "../../utility/helper.js"
import { NAVIGATION_ROUTE_KEYS } from "../../utility/constants/navKeys"
import ProfilePage from "../../views/ProfilePage"
import BusRecords from '../../views/BusRecords';
import RouteRecords from '../../views/RouteRecords'
import RouteConfiguration from "../../views/RouteConfiguration/index.js"
import AuditLog from "../../views/AuditLogs/index.js"

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = "Onboard"
// ** Default Route
const DefaultRoute = "/home"
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"))
const Error = lazy(() => import("../../views/Error"))
const ResetPassword = lazy(() => import("../../views/ResetPassword"))
const EmailVerification = lazy(() => import("../../views/EmailVerification"))

const checkAuth = () => {
  return  localStorage.getItem('token')
}

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <PrivateRoutes component={BusRecords}/>
  },
  {
    path: "/home",
    index: true,
    element: <PrivateRoutes component={BusRecords}/>
  },
  {
    path: "/bus-list",
    element: <PrivateRoutes component={BusRecords}/>
  },
  {
    path: "/route-list",
    element: <PrivateRoutes component={RouteRecords}/>
  },
  {
    path: "/route-configuration",
    element: <PrivateRoutes component={RouteConfiguration}/>
  },
  {
    path: "/logs",
    element: <PrivateRoutes component={AuditLog}/>
  },
  {
    path: "/profile",
    element: <PrivateRoutes component={ProfilePage} />
  },
  {
    path: "/login",
    element: <PublicRoutes component={Login} />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/register",
    element: !isAdmin()?<PublicRoutes component={Register}/>:<></>,
    meta: { layout: "blank" }
  },
  {
    path: "/forgot-password",
    element: <PublicRoutes component={ForgotPassword} />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/reset-password", 
    element: <PublicRoutes component={ResetPassword} />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/email-verification",
    element: <PublicRoutes component={EmailVerification} />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/error",
    element: <AllRoutes component={Error} />,
    meta: {
      layout: "blank"
    }
  }
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)
    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
