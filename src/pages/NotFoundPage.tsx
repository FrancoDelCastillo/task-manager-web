import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <h1 className="text-3xl font-bold">404</h1>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="secondary">
              <Link to="/dashboard">Ir al Inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}