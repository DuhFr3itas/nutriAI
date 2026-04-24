"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation" // Importado para pegar o ID real
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Coffee, Apple, UtensilsCrossed, Cookie, Moon, Salad,
  Edit, RefreshCw, Check, User, Sparkles, Loader2
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const iconMap: Record<string, React.ElementType> = {
  "Café da Manhã": Coffee,
  "Lanche da Manhã": Apple,
  "Almoço": UtensilsCrossed,
  "Lanche da Tarde": Cookie,
  "Jantar": Salad,
  "Ceia": Moon,
}

// Componente interno para usar o searchParams
function DietaGeradaContent() {
  const searchParams = useSearchParams()
  const patientId = searchParams.get("paciente") || "1" // Pega da URL ou usa 1 como fallback de teste
  
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [patientData, setPatientData] = useState({ name: "Carregando...", dailyCalories: 2000, goal: "" })
  const [meals, setMeals] = useState<any[]>([])

  // Ajustado para o nome do campo no banco (total_calories)
  const totalCalories = meals.reduce((acc, meal) => acc + (meal.total_calories || 0), 0)

  useEffect(() => {
    async function loadDietData() {
      const token = localStorage.getItem("access_token")
      if (!token) return

      try {
        // 1. Busca os dados do paciente
        const pRes = await fetch(`http://localhost:8000/patients/${patientId}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        
        if (pRes.ok) {
          const pData = await pRes.json()
          setPatientData({
            name: pData.name,
            dailyCalories: 2000, 
            goal: pData.goal
          })
        }

        // 2. Busca a dieta gerada no seu backend
        const dRes = await fetch(`http://localhost:8000/diets/patient/${patientId}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (dRes.ok) {
          const diets = await dRes.json()
          if (diets.length > 0) {
            // Pegamos a dieta mais recente
            const latestDiet = diets[diets.length - 1]
            const mappedMeals = latestDiet.meals.map((meal: any) => ({
              ...meal,
              icon: iconMap[meal.title] || Salad
            }))
            setMeals(mappedMeals)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDietData()
  }, [patientId])

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    // Chamada futura para a IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRegenerating(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Sincronizando com o NutriAI...</p>
      </div>
    )
  }

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">Gerado por IA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dieta Personalizada</h1>
          <p className="text-muted-foreground">Plano alimentar completo para {patientData.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleRegenerate} disabled={isRegenerating}>
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            Nova Sugestão
          </Button>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={fadeInUp}>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{patientData.name}</h3>
                  <p className="text-sm text-muted-foreground">Objetivo: {patientData.goal || "Não definido"}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{totalCalories}</p>
                  <p className="text-xs text-muted-foreground">kcal total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{patientData.dailyCalories}</p>
                  <p className="text-xs text-muted-foreground">kcal meta</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <motion.div key={meal.id} variants={fadeInUp}>
              <Card className="bg-card h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        {meal.icon && <meal.icon className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <CardTitle className="text-base">{meal.title}</CardTitle>
                        <CardDescription>{meal.time}</CardDescription>
                      </div>
                    </div>
                    {/* Ajustado de totalCalories para total_calories */}
                    <Badge variant="secondary">{meal.total_calories} kcal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meal.foods?.map((food: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{food.name}</p>
                          <p className="text-xs text-muted-foreground">{food.quantity}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{food.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-20 border-2 border-dashed rounded-xl">
             <p className="text-muted-foreground mb-4">Nenhuma dieta gerada ainda para este paciente.</p>
             <Button onClick={handleRegenerate}>Gerar Primeira Sugestão</Button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <Link href={`/dashboard/editar-dieta?paciente=${patientId}`} className="flex-1">
          <Button variant="outline" size="lg" className="w-full h-12 gap-2" disabled={meals.length === 0}>
            <Edit className="w-4 h-4" />
            Editar Dieta
          </Button>
        </Link>
        {/* Agora o botão de aprovar passa o pacienteId para a tela de PDF */}
        <Link href={`/dashboard/gerar-pdf?paciente=${patientId}`} className="flex-1">
          <Button size="lg" className="w-full h-12 gap-2" disabled={meals.length === 0}>
            <Check className="w-4 h-4" />
            Aprovar e Gerar PDF
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

// Wrapper para Suspense (obrigatório no Next.js ao usar useSearchParams)
export default function DietaGeradaPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Carregando interface...</div>}>
      <DietaGeradaContent />
    </Suspense>
  )
}