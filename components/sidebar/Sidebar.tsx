"use client"
import Link from 'next/link';
import React, { useState, useMemo } from "react";

interface MenuItem {
  id: number;
  label: string;
  link: string;
}

const menuItems = [
  { id: 1, label: "", link: "/" },
];

export const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const activePath = "/posts";

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === activePath),
    [activePath]
  );

  const wrapperClasses = `h-screen px-4 pt-4 pb-4 bg-borderColor flex justify-between flex-col ${
    toggleCollapse ? "w-20" : "w-60"
  }`;

  const collapseIconClasses = `p-4 rounded bg-borderColor absolute right-0 ${
    toggleCollapse ? "rotate-180" : ""
  }`;

  const getNavItemClasses = (menu: MenuItem) => {
    return `flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap ${
      activeMenu?.id === menu.id ? "bg-light-lighter" : ""
    }`;
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <div />
            <span
              className={`mt-2 text-2xl font-medium text-title ${
                toggleCollapse ? "hidden" : ""
              }`}
            >
              Gream
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <div />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
          {menuItems.map((menu) => {
            const classes = getNavItemClasses(menu);
            return (
                <div key={menu.id} className={classes}>
                <Link href={menu.link} className="flex py-4 px-3 items-center w-full h-full">
                    <div style={{ width: "2.5rem" }}>
                      <div />
                    </div>
                    {!toggleCollapse && (
                      <span className="text-md font-medium text-text-light">
                        {menu.label}
                      </span>
                    )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

