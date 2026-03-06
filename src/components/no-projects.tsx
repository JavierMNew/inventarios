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
