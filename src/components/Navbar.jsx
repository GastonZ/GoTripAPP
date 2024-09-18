import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { icons } from '../assets'
import { Link } from 'react-router-dom'

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Iniciar sesión', href: '/iniciar', current: false },
  { name: 'Registrarse', href: '/registro', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-primary-blue">
      <div className="mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative flex justify-between items-center h-16">
          <div className="left-0 absolute inset-y-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="inline-flex relative justify-center items-center hover:bg-gray-700 p-2 rounded-md focus:ring-2 focus:ring-white focus:ring-inset text-gray-400 hover:text-white group focus:outline-none">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon aria-hidden="true" className="block group-data-[open]:hidden w-6 h-6" />
              <XMarkIcon aria-hidden="true" className="group-data-[open]:block hidden w-6 h-6" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 justify-center sm:justify-start items-center sm:items-stretch">
            <div className="flex flex-shrink-0 items-center">
              <img
                alt="Go Trip Logo"
                src={icons.gotripLogo}
                className="w-auto h-8"
              />
            </div>
            <div className="sm:block hidden sm:ml-6">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-black transition-all hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm uppercase font-semibold',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="right-0 sm:static absolute inset-y-0 sm:inset-auto flex items-center sm:ml-6 pr-2 sm:pr-0">
            <button
              type="button"
              className="relative bg-gray-800 p-1 rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 text-gray-400 hover:text-white focus:outline-none"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon aria-hidden="true" className="w-6 h-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex bg-gray-800 rounded-full focus:ring-offset-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Abrir menú de usuario</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="rounded-full w-8 h-8"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="right-0 z-10 absolute bg-white ring-opacity-5 data-[closed]:opacity-0 shadow-lg mt-2 py-1 rounded-md ring-1 ring-black w-48 data-[closed]:transform origin-top-right transition focus:outline-none data-[closed]:scale-95 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a href="#" className="block data-[focus]:bg-gray-100 px-4 py-2 text-black text-sm">
                    Tu perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block data-[focus]:bg-gray-100 px-4 py-2 text-black text-sm">
                    Ajustes
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block data-[focus]:bg-gray-100 px-4 py-2 text-black text-sm">
                    Cerrar sesión
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
