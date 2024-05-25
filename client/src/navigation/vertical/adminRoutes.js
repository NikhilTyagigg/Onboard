import { Users, DollarSign, CreditCard } from "react-feather"

const adminRoute = [
    {
        id: "all-profile",
        title: "All Users",
        icon: <Users size={20} />,
        navLink: "/all-users"
    },
    /*{
        id: "document-tokens",
        title: "Document Tokens",
        icon: <DollarSign size={20} />,
        navLink: "/document-tokens"
    },
    {
        id: "billing",
        title: "Usage & Billing",
        icon: <CreditCard size={20} />,
        navLink: "/billing-usage"
    }*/
]

export default adminRoute