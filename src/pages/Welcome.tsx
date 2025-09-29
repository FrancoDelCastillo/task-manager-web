import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Welcome() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkProfile = async () => {
      setLoading(true)
      setError(null)

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        setError(error?.message || "No se pudo obtener usuario")
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single()

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      if (profile?.avatar_url) {
        navigate("/dashboard")
        return
      }

      setLoading(false)
    }

    checkProfile()
  }, [navigate])

  const handleUploadAvatar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!avatarFile || !userId) {
      navigate("/dashboard")
      return
    }

    const filePath = `${userId}/avatar/avatar.png`

    console.log("file path upload", filePath)

    const { error: avatarError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true })

    if (avatarError) {
      setError(avatarError.message)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq("id", userId)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate("/dashboard")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <h1 className="text-xl font-semibold mb-4 text-center">
            ¡Bienvenido a Task Manager!
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Tu cuenta fue confirmada con éxito. Sube un avatar para completar tu perfil
            o continúa al dashboard.
          </p>

          <form onSubmit={handleUploadAvatar} className="space-y-4">
            <div>
              <Label htmlFor="avatar">Foto de perfil (opcional)</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" className="w-1/2">
                Guardar y continuar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => navigate("/dashboard")}
              >
                Omitir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}