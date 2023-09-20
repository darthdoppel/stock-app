import { useState } from 'react'
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem
} from '@nextui-org/react'
import { useLocation } from 'react-router-dom'
import { ThemeSwitcher } from './ThemeSwitcher'

export default function NavBar () {
  const location = useLocation()
  const currentPath = location.pathname
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getLinkColor = (path: string) => {
    return currentPath === path ? 'primary' : 'foreground'
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/dashboard" isBlock size="lg" underline="none" color="foreground">STOCK APP</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={currentPath === '/dashboard'}>
          <Link color={getLinkColor('/dashboard')} href="/dashboard" aria-current={currentPath === '/dashboard' ? 'page' : undefined}>
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={currentPath === '/'}>
          <Link color={getLinkColor('/')} href="/" aria-current={currentPath === '/' ? 'page' : undefined}>
            Accesorios
          </Link>
        </NavbarItem>
        <NavbarItem isActive={currentPath === '/clients'}>
          <Link color={getLinkColor('/clients')} href="/clients" aria-current={currentPath === '/clients' ? 'page' : undefined}>
            Clientes
          </Link>
        </NavbarItem>
        <NavbarItem isActive={currentPath === '/sales'}>
          <Link color={getLinkColor('/sales')} href="/sales" aria-current={currentPath === '/sales' ? 'page' : undefined}>
            Ventas
          </Link>
        </NavbarItem>
        <NavbarItem isActive={currentPath === '/work-orders'}>
          <Link color={getLinkColor('/work-orders')} href="/work-orders" aria-current={currentPath === '/work-orders' ? 'page' : undefined}>
            Ordenes de trabajo
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="flex items-center">
        <ThemeSwitcher />
      </NavbarContent>

      {/* Menú desplegable para dispositivos móviles */}
      <NavbarMenu>
        <NavbarMenuItem>
          <Link color={getLinkColor('/dashboard')} href="/dashboard">
            Dashboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color={getLinkColor('/')} href="/">
            Accesorios
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color={getLinkColor('/clients')} href="/clients">
            Clientes
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color={getLinkColor('/sales')} href="/sales">
            Ventas
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color={getLinkColor('/work-orders')} href="/work-orders">
            Ordenes de trabajo
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}
