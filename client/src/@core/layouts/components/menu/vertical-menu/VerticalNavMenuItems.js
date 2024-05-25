// ** Vertical Menu Components
import VerticalNavMenuLink from "./VerticalNavMenuLink"
import VerticalNavMenuGroup from "./VerticalNavMenuGroup"
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader"
import { canViewMenuGroup } from "../../../utils"

// ** Utils
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@layouts/utils"

const VerticalMenuNavItems = (props) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return (
        (
          <TagName className="d-flex align-items-center active" item={item} index={index} key={item.id} {...props} />
        )
      )
    }
    
    return <TagName className="d-flex align-items-center active" key={item.id || item.header+'_'+index} item={item} {...props} />
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
