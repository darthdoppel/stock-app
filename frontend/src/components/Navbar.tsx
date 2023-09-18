import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react'
import { useLocation } from 'react-router-dom'
import { ThemeSwitcher } from './ThemeSwitcher'

export default function NavBar () {
  const location = useLocation()
  const currentPath = location.pathname

  const getLinkColor = (path: string) => {
    return currentPath === path ? 'primary' : 'foreground'
  }

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 mb-4">
      <NavbarBrand>
        <p className="font-bold text-inherit">STOCK APP</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
      <NavbarContent justify="end" className="flex items-center"> {/* Agrega la clase flex y items-center */}
        <ThemeSwitcher /> {/* Agrega el ThemeSwitcher aquí */}
        <NavbarItem className="hidden lg:flex">
          <Link color="foreground" href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Registro
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
