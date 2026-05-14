"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, FileText, Download, TrendingUp, 
  Weight, Ruler, Target, Plus, Loader2, ClipboardCheck
} from "lucide-react"
import Link from "next/link"

export default function DetalhesPacientePage() {
  const { id } = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPatient() {
      const token = localStorage.getItem("access_token")
      try {
        const response = await fetch(`http://localhost:8000/patients/${id}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setPatient(data)
        }
      } catch (error) {
        console.error("Erro:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPatient()
  }, [id])

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!patient) return <div className="p-10 text-center">Paciente não encontrado. Verifique a rota no backend.</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header com Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-muted-foreground">Paciente desde {new Date(patient.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <Link href={`/dashboard/criar-dieta?paciente=${id}`}>
          <Button className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="h-4 w-4" /> Nova Dieta com IA
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1: Perfil e Dados Físicos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">E-mail:</span>
                <span className="font-medium">{patient.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground flex items-center gap-2"><Weight className="h-4 w-4"/> Peso:</span>
                <span className="font-medium">{patient.weight}kg</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground flex items-center gap-2"><Ruler className="h-4 w-4"/> Altura:</span>
                <span className="font-medium">{patient.height}cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4"/> Objetivo:</span>
                <Badge variant="secondary">{patient.goal}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Relatório de Evolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Análise automática baseada no peso inicial e metas.</p>
              <div className="space-y-2">
                <div className="text-sm font-medium">Meta: {patient.goal}</div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[35%]" /> {/* Simulação de progresso */}
                </div>
                <p className="text-[10px] text-right text-muted-foreground">35% do objetivo alcançado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2 e 3: Dietas e Histórico */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" /> Planos Alimentares (PDFs)
              </CardTitle>
              <CardDescription>Visualize ou baixe as dietas geradas para este paciente.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Lista Simulada de PDFs - Quando ligarmos o banco de dietas, faremos um .map aqui */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded">PDF</div>
                    <div>
                      <p className="font-medium text-sm">Dieta_Fase_1_{patient.name}.pdf</p>
                      <p className="text-xs text-muted-foreground">Gerado em 20/04/2026</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer opacity-60">
                   <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded">PDF</div>
                    <div>
                      <p className="font-medium text-sm">Ajuste_Calorico_Mensal.pdf</p>
                      <p className="text-xs text-muted-foreground">Gerado em 05/04/2026</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-600" /> Observações Clínicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full min-h-[150px] p-3 rounded-md border bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Anote aqui observações sobre a última consulta, dificuldades relatadas ou ajustes necessários..."
              />
              <div className="flex justify-end mt-2">
                <Button size="sm">Salvar Anotação</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}