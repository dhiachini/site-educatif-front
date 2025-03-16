import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();

  // Retrieve the user's role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; // "teacher" or "student"

  // State data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [isLanding, setIsLanding] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
  ]);

  // Menu items for teacher
  const teacherMenu = [
    {
      id: "لوحة المعلم",
      label: "لوحة المعلم",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "جدول التلاميذ",
          label: "جدول التلاميذ",
          link: "/students-table",
          parentId: "dashboard",
        },
        {
          id: "إضافة المستوى",
          label: "إضافة المستوى",
          link: "/add-level",
          parentId: "dashboard",
        },
        {
          id: "إضافة الدروس",
          label: "إضافة الدروس",
          link: "/add-lesson",
          parentId: "dashboard",
        },
      ],
    },
  ];

  // Menu items for student
  const studentMenu = [
    {
      id: "لوحة التلميذ",
      label: "لوحة التلميذ",
      icon: "ri-apps-2-line",
      link: "/#",
      style: { fontSize: '24px' }, // Larger font size for the main menu item
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "مراجعة الدرس",
          label: "مراجعة الدرس",
          link: "/add-student",
          parentId: "apps",
          style: { fontSize: '20px' }, // Larger font size for sub-items
        },
        
        {
          id: "ركن التمارين",
          label: "ركن التمارين",
          link: "/quiz",
          parentId: "apps",
          style: { fontSize: '20px' }, // Larger font size for sub-items
        },
        {
          id: "المخبر الإفتراضي",
          label: "المختبر الإفتراضي",
          link: "/lab",
          parentId: "apps",
          style: { fontSize: '20px' }, // Larger font size for sub-items
        },
        {
          id: "ركن أجرب",
          label: "أجرب",
          link: "/rabbit-exercice",
          parentId: "apps",
          style: { fontSize: '20px' }, // Larger font size for sub-items
        },
        
        {
          id: "ركن أقيم",
          label: "أقيم",
          link: "/test",
          parentId: "apps",
          style: { fontSize: '20px' }, // Larger font size for sub-items
        },
      ],
    },
  ];

  // Determine which menu to show based on the role
  const menuItems = [
    {label:"   ",
      isHeader: true,
    },
    ...(role === "teacher" ? teacherMenu : []), // Show teacher menu if role is "teacher"
    ...(role === "student" ? studentMenu : []), // Show student menu if role is "student"
  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
