"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditarPacientePage() {
  const { id } = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    goal: ""
  })

  // Carrega os dados atuais do paciente
  useEffect(() => {
    async function loadPatient() {
      const token = localStorage.getItem("access_token")
      try {
        const response = await fetch(`http://localhost:8000/patients/${id}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setFormData({
            name: data.name,
            email: data.email,
            age: data.age.toString(),
            weight: data.weight.toString(),
            height: data.height.toString(),
            goal: data.goal
          })
        }
      } catch (error) {
        console.error("Erro ao carregar:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPatient()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const token = localStorage.getItem("access_token")
    try {
      const response = await fetch(`http://localhost:8000/patients/${id}/`, {
        method: "PUT", // Usamos PUT para atualização
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height)
        })
      })

      if (response.ok) {
        router.push("/dashboard/pacientes")
        router.refresh()
      } else {
        alert("Erro ao atualizar paciente.")
      }
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Editar Paciente</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atualizar Informações</CardTitle>
          <CardDescription>Modifique os campos necessários e clique em salvar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Nome Completo</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Idade</Label>
                <Input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Peso (kg)</Label>
                <Input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Altura (cm)</Label>
                <Input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Objetivo Principal</Label>
              <Select value={formData.goal} onValueChange={(value) => setFormData({...formData, goal: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                  <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Reeducação Alimentar">Reeducação Alimentar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}