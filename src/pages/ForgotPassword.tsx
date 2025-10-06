import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage("Revisa tu correo, hemos enviado un enlace para restablecer tu contraseña.")
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <Card className="relative w-full max-w-md p-6 shadow-lg">
        {/* Botón de cerrar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => navigate("/login")}
        >
          <X className="h-5 w-5" />
        </Button>

        <CardContent>
          <h1 className="text-xl font-semibold mb-4">¿Olvidaste tu contraseña?</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}