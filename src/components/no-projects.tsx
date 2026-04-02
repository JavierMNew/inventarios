import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyOutline() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No tienes empresas</EmptyTitle>
        <EmptyDescription>
          Crea una empresa para empezar a usar la plataforma.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="default">
          <a href="/create-company">Crear empresa</a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
export function EmptyMembers() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No tienes miembros</EmptyTitle>
        <EmptyDescription>
          Agrega miembros a la empresa para para aumentar la productividad.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="default">
          <a href="/create-member">Agregar miembro</a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
