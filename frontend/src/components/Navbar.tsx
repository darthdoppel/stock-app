import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react'

export default function NavBar () {
  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 mb-4">
      <NavbarBrand>
        <p className="font-bold text-inherit">STOCK APP</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Accesorios
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Clientes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/sales">
            Ventas
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
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
