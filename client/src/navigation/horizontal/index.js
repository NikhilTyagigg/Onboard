import { Mail, Home, Edit, List, AlignLeft } from "react-feather"

export default [
  {
    id: "content-creator",
    title: "Creator",
    icon: <AlignLeft size={20} />,
    navLink: "/document-list"
  },
  {
    id: "summarize",
    title: "Text Summarization",
    icon: <Edit size={20} />,
    navLink: "/summarize"
  },
  {
    id: "paraphrase",
    title: "Text Paraphrase",
    icon: <List size={20} />,
    navLink: "/paraphrase"
  },
  // {
  //   id: "paraphrase-v2",
  //   title: "Text Paraphrase V2",
  //   icon: <Mail size={20} />,
  //   navLink: "/paraphrase-v2"
  // },
  // {
  //   id: "templates",
  //   title: "Templates",
  //   icon: <Mail size={20} />,
  //   navLink: "/template"
  // },
  // {
  //   id: "text generator",
  //   title: "Text Generator",
  //   icon: <Mail size={20} />,
  //   navLink: "/text-generator"
  // }
]
