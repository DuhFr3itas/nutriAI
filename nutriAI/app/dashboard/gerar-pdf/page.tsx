"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Download, Mail, Printer, Check, User, Target, Scale,
  Flame, Coffee, Apple, UtensilsCrossed, Cookie, Moon, Salad,
  ArrowLeft, Leaf, Loader2
} from "lucide-react"

// Estilos de animação
const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }
const stagger = { animate: { transition: { staggerChildren: 0.08 } } }

const iconMap: Record<string, React.ElementType> = {
  "Café da Manhã": Coffee,
  "Lanche da Manhã": Apple,
  "Almoço": UtensilsCrossed,
  "Lanche da Tarde": Cookie,
  "Jantar": Salad,
  "Ceia": Moon,
}

function GerarPDFContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("paciente")
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [patientData, setPatientData] = useState<any>(null)
  const [meals, setMeals] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      if (!patientId) return
      const token = localStorage.getItem("access_token")

      try {
        // 1. Busca dados do Paciente
        const pRes = await fetch(`http://localhost:8000/patients/${patientId}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        
        // 2. Busca a última Dieta salva para este paciente
        const dRes = await fetch(`http://localhost:8000/diets/patient/${patientId}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (pRes.ok) {
          const p = await pRes.json()
          const imc = p.height > 0 ? (p.weight / ((p.height/100) ** 2)).toFixed(1) : "0.0"
          setPatientData({ ...p, imc })
        }

        if (dRes.ok) {
          const diets = await dRes.json()
          if (diets.length > 0) {
            // Pegamos a dieta mais recente (última da lista)
            const latestDiet = diets[diets.length - 1]
            setMeals(latestDiet.meals || [])
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do PDF:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [patientId])

  const totalCalories = meals.reduce((acc, m) => acc + (m.total_calories || 0), 0)

  const handleSaveAndDownload = async () => {
    setIsGenerating(true)
    // Simulação: Aqui chamaremos a função que gera o Blob do PDF e envia pro Backend
    await new Promise(r => setTimeout(r, 1500))
    setPdfGenerated(true)
    setIsGenerating(false)
    alert("PDF gerado e salvo no histórico do paciente!")
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center gap-2"><Loader2 className="animate-spin" /> Preparando documento...</div>
  if (!patientData) return <div className="p-10 text-center">Erro: Selecione um paciente válido.</div>

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Exportar Plano Alimentar</h1>
          <p className="text-muted-foreground text-sm">Confira os dados antes de gerar o arquivo final</p>
        </div>
      </motion.div>

      {/* Preview do Papel A4 */}
      <motion.div variants={fadeInUp} className="shadow-2xl border rounded-sm overflow-hidden">
        <div className="bg-white text-slate-900 p-10 min-h-[1100px] font-sans">
          
          {/* Logo e Data */}
          <div className="flex justify-between items-start border-b-2 border-green-500 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg"><Leaf className="text-white w-6 h-6" /></div>
              <h2 className="text-2xl font-black tracking-tighter text-green-700">NutriAI</h2>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p className="font-bold">DOCUMENTO OFICIAL</p>
              <p>Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {/* Info Paciente */}
          <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl mb-8 border border-slate-100">
            <div className="col-span-4 mb-2 flex items-center gap-2 text-green-700 font-bold uppercase text-xs tracking-widest">
              <User className="w-4 h-4" /> Perfil do Paciente
            </div>
            <div><p className="text-[10px] text-slate-400 uppercase">Nome</p><p className="font-bold text-sm">{patientData.name}</p></div>
            <div><p className="text-[10px] text-slate-400 uppercase">IMC</p><p className="font-bold text-sm">{patientData.imc} kg/m²</p></div>
            <div><p className="text-[10px] text-slate-400 uppercase">Peso Atual</p><p className="font-bold text-sm">{patientData.weight}kg</p></div>
            <div><p className="text-[10px] text-slate-400 uppercase">Meta</p><Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">{patientData.goal}</Badge></div>
          </div>

          {/* Refeições */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-l-4 border-green-500 pl-3">Cronograma Alimentar</h3>
            
            {meals.map((meal: any) => {
              const Icon = iconMap[meal.title] || Salad
              return (
                <div key={meal.id} className="border border-slate-100 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-slate-800">{meal.title}</span>
                      <span className="text-slate-400 text-sm"> às {meal.time}</span>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{meal.total_calories} kcal</span>
                  </div>
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-slate-50">
                        <th className="pb-2 font-medium">Alimento</th>
                        <th className="pb-2 font-medium text-right">Quantidade</th>
                        <th className="pb-2 font-medium text-right">Kcal</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {meal.foods?.map((food: any) => (
                        <tr key={food.id} className="border-b border-slate-50 last:border-0">
                          <td className="py-2">{food.name}</td>
                          <td className="py-2 text-right">{food.quantity}</td>
                          <td className="py-2 text-right font-medium">{food.calories}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>

          {/* Resumo Final */}
          <div className="mt-10 bg-green-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
            <div>
              <p className="text-green-100 text-xs uppercase tracking-widest font-bold">Valor Energético Total</p>
              <h4 className="text-3xl font-black">{totalCalories} <span className="text-sm font-normal">kcal / dia</span></h4>
            </div>
            <div className="text-right text-xs text-green-100">
              <p>Plano calculado via NutriAI</p>
              <p>Baseado em diretrizes nutricionais 2026</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Botões de Ação */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-3">
        {!pdfGenerated ? (
          <Button size="lg" className="h-16 text-lg gap-2 shadow-xl" onClick={handleSaveAndDownload} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" /> : <FileText />}
            Confirmar e Gerar PDF Final
          </Button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button size="lg" className="h-14 gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-5 h-5" /> Baixar PDF
            </Button>
            <Button size="lg" variant="outline" className="h-14 gap-2 border-blue-200">
              <Mail className="w-5 h-5" /> Enviar por E-mail
            </Button>
            <Button size="lg" variant="outline" className="h-14 gap-2 border-blue-200">
              <Printer className="w-5 h-5" /> Imprimir
            </Button>
          </div>
        )}
      </motion.div>

    </motion.div>
  )
}

export default function GerarPDFPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
      <GerarPDFContent />
    </Suspense>
  )
}