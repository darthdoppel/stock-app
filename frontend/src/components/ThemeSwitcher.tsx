import { Switch } from '@nextui-org/react'
import SunIcon from '../icons/SunIcon'
import { MoonIcon } from '../icons/MoonIcon'
import { useTheme } from 'next-themes'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  // Función que se ejecuta cuando el Switch cambia de valor
  const handleThemeToggle = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <Switch
      defaultSelected={theme === 'dark'}
      size="lg"
      color="success"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      onChange={handleThemeToggle}
      aria-label="Toggle theme"
    >
    </Switch>
  )
}
