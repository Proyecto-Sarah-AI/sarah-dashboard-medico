
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyAdherenceChart } from "./daily-adherence-chart"
import { WeeklyAdherenceChart } from "./weekly-adherence-chart"
import { AdherenceChart } from "./adherence-chart"
import type { DailyAdherence, WeeklyAdherence, AdherenceHistory } from "@/lib/mock-data"

interface AdherenceChartsContainerProps {
  dailyData: DailyAdherence[]
  weeklyData: WeeklyAdherence[]
  adherenceHistoryData: AdherenceHistory[]
}

export function AdherenceChartsContainer({ 
  dailyData, 
  weeklyData, 
  adherenceHistoryData 
}: AdherenceChartsContainerProps) {
  const [adherenceType, setAdherenceType] = useState<"farmacologica" | "cuidado" | "persistencia">("farmacologica")

  const typeLabels = {
    farmacologica: "Farmacológica",
    cuidado: "Cuidado",
    persistencia: "Persistencia"
  }

  return (
    <Card className="border-border overflow-hidden" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Gráficos de Adherencia</CardTitle>
          <Tabs value={adherenceType} onValueChange={(v) => setAdherenceType(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="farmacologica" className="text-xs">
                Farmacológica
              </TabsTrigger>
              <TabsTrigger value="cuidado" className="text-xs">
                Cuidado
              </TabsTrigger>
              <TabsTrigger value="persistencia" className="text-xs">
                Persistencia
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Adherence Chart */}
        <DailyAdherenceChart data={dailyData} title={`Adherencia Diaria - ${typeLabels[adherenceType]}`} />

        {/* Weekly and Trend Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeeklyAdherenceChart data={weeklyData} />
          <AdherenceChart 
            data={adherenceHistoryData} 
            title={`Tendencia de Adherencia - ${typeLabels[adherenceType]}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
