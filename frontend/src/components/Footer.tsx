import { Link } from '@nextui-org/react'

function Footer () {
  return (
    <footer className="text-center py-4 mt-10">
      <p className="text-gray-600">
        Hecho por Leandro Magallanes -{' '}
        <Link href="https://www.linkedin.com/in/leandro-magallanes-681902173/" color="primary" target="_blank">
          LinkedIn
        </Link>
      </p>
    </footer>
  )
}

export default Footer
