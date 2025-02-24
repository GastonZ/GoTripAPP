import { useState, useEffect } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { icons } from "../assets";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!userName);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserName = localStorage.getItem("userName") || "";
      const adminStatus = localStorage.getItem("isAdmin") === "true"; 
      setUserName(storedUserName);
      setIsAuthenticated(!!storedUserName);
      setIsAdmin(adminStatus);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navigation = [
    { name: "Home", href: "/", current: false, show: true },
    { name: "Iniciar sesión", href: "/iniciar", current: false, show: !isAuthenticated },
    { name: "Opciones", href: "/opciones", current: false, show: isAuthenticated },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("isNoVidente");
    localStorage.removeItem("isAdmin");
    setUserName("");
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-primary-blue">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Botón menú móvil */}
          <div className="sm:hidden left-0 absolute inset-y-0 flex items-center">
            <DisclosureButton className="group inline-flex relative justify-center items-center hover:bg-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset text-gray-400 hover:text-white">
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon aria-hidden="true" className="group-data-[open]:hidden block w-6 h-6" />
              <XMarkIcon aria-hidden="true" className="group-data-[open]:block hidden w-6 h-6" />
            </DisclosureButton>
          </div>

          {/* Logo y navegación */}
          <div className="flex flex-1 justify-center sm:justify-start items-center sm:items-stretch">
            <div className="flex flex-shrink-0 items-center">
              <img alt="Go Trip Logo" src={icons.gotripLogo} className="w-auto h-8" />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  item.show && (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current ? "bg-gray-900 text-white" : "text-black transition-all hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm uppercase font-semibold"
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="right-0 sm:static absolute inset-y-0 sm:inset-auto flex items-center sm:ml-6 pr-2 sm:pr-0">
            {isAuthenticated && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 text-sm">
                    <span className="sr-only">Abrir menú de usuario</span>
                    <p className="px-4 py-2 text-white">{userName}</p>
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="right-0 z-10 absolute bg-white ring-opacity-5 data-[closed]:opacity-0 shadow-lg mt-2 py-1 rounded-md focus:outline-none ring-1 ring-black w-48 data-[closed]:scale-95 origin-top-right transition data-[enter]:duration-100 data-[leave]:duration-75 data-[leave]:ease-in data-[enter]:ease-out data-[closed]:transform"
                >
                  {isAdmin && (
                    <MenuItem>
                      <Link to={"/admin"}>
                        <p className="block data-[focus]:bg-gray-100 px-4 py-2 text-black text-sm">
                          Panel admin
                        </p>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <button onClick={handleLogout} className="block data-[focus]:bg-gray-100 px-4 py-2 w-full text-black text-sm text-left">
                      Cerrar sesión
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            item.show && (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            )
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
