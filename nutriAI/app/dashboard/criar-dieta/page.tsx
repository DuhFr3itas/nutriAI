"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, User, Activity, AlertCircle, Loader2 } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

// Separamos o formulário em um componente para poder usar o useSearchParams com Suspense (exigência do Next.js)
function DietForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pacienteIdDaUrl = searchParams.get("paciente")

  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>(pacienteIdDaUrl || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  // Estados dos formulários de dieta
  const [activityLevel, setActivityLevel] = useState("")
  const [restrictions, setRestrictions] = useState({
    lactose: false,
    gluten: false,
    amendoim: false,
    vegetariano: false,
    vegano: false,
  })
  const [otherRestrictions, setOtherRestrictions] = useState("")

  // Busca os pacientes no banco
  useEffect(() => {
    async function fetchPatients() {
      const token = localStorage.getItem("access_token")
      if (!token) return

      try {
        const response = await fetch("http://localhost:8000/patients/", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setPatients(data)
        }
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error)
      } finally {
        setIsLoadingPatients(false)
      }
    }
    fetchPatients()
  }, [])

  // Encontra os dados do paciente selecionado para mostrar o resumo
  const selectedPatient = patients.find(p => p.id.toString() === selectedPatientId)

  const handleCheckboxChange = (restriction: keyof typeof restrictions) => {
    setRestrictions(prev => ({ ...prev, [restriction]: !prev[restriction] }))
  }

  const handleGenerateDiet = async () => {
    if (!selectedPatientId) {
      alert("Por favor, selecione um paciente primeiro.")
      return
    }

    setIsGenerating(true)
    
    // COMO A IA AINDA NÃO ESTÁ LIGADA, VAMOS SIMULAR UM CARREGAMENTO
    // E REDIRECIONAR PARA A TELA DA DIETA GERADA APÓS 2 SEGUNDOS
    setTimeout(() => {
      // No futuro, aqui enviaremos os dados de restrição para a IA no backend
      setIsGenerating(false)
      router.push("/dashboard/dieta-gerada")
    }, 2000)
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Configurar Dieta</h1>
        <p className="text-muted-foreground">Selecione o paciente e defina os parâmetros para a Inteligência Artificial gerar o cardápio.</p>
      </motion.div>

      {/* 1. Seleção de Paciente */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Paciente
            </CardTitle>
            <CardDescription>Escolha para quem a dieta será gerada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingPatients ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando lista de pacientes...
              </div>
            ) : (
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente cadastrado..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.length > 0 ? (
                    patients.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhum paciente cadastrado</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}

            {/* Resumo do Paciente Selecionado */}
            {selectedPatient && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedPatient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPatient.age} anos • {selectedPatient.weight}kg • {selectedPatient.height}cm
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Objetivo Atual</p>
                  <p className="text-sm font-medium text-primary">{selectedPatient.goal || "Não definido"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. Parâmetros Físicos */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Nível de Atividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de atividade diária..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentario">Sedentário (Pouco ou nenhum exercício)</SelectItem>
                <SelectItem value="leve">Levemente Ativo (Exercício leve 1-3 dias/semana)</SelectItem>
                <SelectItem value="moderado">Moderado (Exercício moderado 3-5 dias/semana)</SelectItem>
                <SelectItem value="ativo">Muito Ativo (Exercício intenso 6-7 dias/semana)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. Restrições Alimentares */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Restrições Alimentares
            </CardTitle>
            <CardDescription>Selecione as alergias e preferências do paciente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={restrictions.lactose} onChange={() => handleCheckboxChange('lactose')} />
                <span className="text-sm font-medium leading-none">Intolerância à Lactose</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={restrictions.gluten} onChange={() => handleCheckboxChange('gluten')} />
                <span className="text-sm font-medium leading-none">Intolerância ao Glúten</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={restrictions.amendoim} onChange={() => handleCheckboxChange('amendoim')} />
                <span className="text-sm font-medium leading-none">Alergia a Amendoim</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={restrictions.vegetariano} onChange={() => handleCheckboxChange('vegetariano')} />
                <span className="text-sm font-medium leading-none">Vegetariano</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={restrictions.vegano} onChange={() => handleCheckboxChange('vegano')} />
                <span className="text-sm font-medium leading-none">Vegano</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outras">Outras Restrições ou Observações</Label>
              <Textarea 
                id="outras" 
                placeholder="Descreva outras alergias, alimentos que não gosta, etc..." 
                value={otherRestrictions}
                onChange={(e) => setOtherRestrictions(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. Botão de Gerar */}
      <motion.div variants={fadeInUp} className="pt-4 pb-12">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all"
          onClick={handleGenerateDiet}
          disabled={isGenerating || !selectedPatientId}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando com IA...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Gerar Dieta com IA
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default function CriarDietaPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <DietForm />
    </Suspense>
  )
}