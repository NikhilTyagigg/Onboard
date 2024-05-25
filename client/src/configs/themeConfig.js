// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: "Onboard",
    appLogoImage: require("@src/assets/images/logo/pd_logo.svg").default
  },
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    type: "vertical", // vertical, horizontal
    contentWidth: "full", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "sticky", // static , sticky , floating, hidden
      backgroundColor: "white" // BS color options [primary, success, etc]
    },
    footer: {
      type: "hidden" // static, sticky, hidden
    },
    customizer: false,
    scrollTop: false, // Enable scroll to top button
    toastPosition: "top-right" // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
