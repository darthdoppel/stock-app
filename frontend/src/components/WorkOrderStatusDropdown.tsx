import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { VerticalDotsIcon } from './VerticalDotsIcon'
import { toast } from 'sonner'

interface WorkOrderStatusDropdownProps {
  status: string
  onStatusChange: (newStatus: string) => void
}

const statusKeys = ['pending', 'in-progress', 'completed', 'cancelled'] as const

type StatusKey = typeof statusKeys[number]

const statusLabels: Record<StatusKey, string> = {
  pending: 'Pendiente',
  'in-progress': 'En progreso',
  completed: 'Completado',
  cancelled: 'Cancelado'
}

export const WorkOrderStatusDropdown: React.FC<WorkOrderStatusDropdownProps> = ({ status, onStatusChange }) => {
  const handleStatusSelect = (newStatus: StatusKey) => {
    onStatusChange(newStatus)
    toast.success(`Estado cambiado a ${statusLabels[newStatus]}`)
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <VerticalDotsIcon className="text-default-300" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {statusKeys.map((s) => (
          <DropdownItem key={s} onClick={() => { handleStatusSelect(s) }}>
            {statusLabels[s]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
