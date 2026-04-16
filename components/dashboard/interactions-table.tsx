"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PatientInteraction, ChatMessage } from "@/lib/mock-data"
import { getInteractionTypeLabel, getInteractionResultLabel, markInteractionAsReviewed } from "@/lib/mock-data"
import { 
  MessageSquare, 
  Pill, 
  Stethoscope, 
  Calendar, 
  Scale, 
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Bot,
  User,
  CheckCheck
} from "lucide-react"

interface InteractionsTableProps {
  interactions: PatientInteraction[]
  title?: string
}

const typeIcons = {
  medication_report: Pill,
  symptom_report: Stethoscope,
  appointment: Calendar,
  chat: MessageSquare,
  weight_log: Scale,
  mood_log: Heart
}

const resultConfig = {
  completed: { 
    icon: CheckCircle, 
    color: "bg-success/10 text-success",
    badgeColor: "bg-success text-success-foreground"
  },
  skipped: { 
    icon: XCircle, 
    color: "bg-warning/10 text-warning",
    badgeColor: "bg-warning text-warning-foreground"
  },
  error: { 
    icon: AlertCircle, 
    color: "bg-destructive/10 text-destructive",
    badgeColor: "bg-destructive text-destructive-foreground"
  },
  pending: { 
    icon: Clock, 
    color: "bg-muted text-muted-foreground",
    badgeColor: "bg-muted text-foreground"
  }
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("es-MX", { 
    hour: "2-digit", 
    minute: "2-digit"
  })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

interface ChatModalProps {
  interaction: PatientInteraction | null
  isOpen: boolean
  onClose: () => void
  onMarkAsReviewed: (id: string) => void
}

function ChatModal({ interaction, isOpen, onClose, onMarkAsReviewed }: ChatModalProps) {
  if (!interaction) return null

  const messages = interaction.chatMessages || []
  const hasMessages = messages.length > 0

  const handleMarkAsReviewed = () => {
    onMarkAsReviewed(interaction.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Chat de Interaccion
          </DialogTitle>
          <DialogDescription>
            {formatDate(interaction.date)} - {getInteractionTypeLabel(interaction.type)}
          </DialogDescription>
        </DialogHeader>

        {hasMessages ? (
          <ScrollArea className="flex-1 max-h-[400px] pr-4">
            <div className="space-y-3 py-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.sender === "patient" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    message.sender === "sarah" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {message.sender === "sarah" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className={cn(
                    "flex flex-col max-w-[75%]",
                    message.sender === "patient" ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-3 py-2 rounded-lg text-sm",
                      message.sender === "sarah"
                        ? "bg-primary/10 text-foreground rounded-tl-none"
                        : "bg-muted text-foreground rounded-tr-none"
                    )}>
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.sender === "sarah" ? "Sarah (IA)" : "Paciente"} - {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted/50 p-4 mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay mensajes registrados para esta interaccion</p>
          </div>
        )}

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          {!interaction.isReviewed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAsReviewed}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar como revisada
            </Button>
          )}
          {interaction.isReviewed && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCheck className="h-3 w-3 text-success" />
              Revisada
            </span>
          )}
          <Button variant="default" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function InteractionsTable({ interactions, title = "Historial de Interacciones" }: InteractionsTableProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<PatientInteraction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localInteractions, setLocalInteractions] = useState(interactions)

  const handleViewChat = (interaction: PatientInteraction) => {
    setSelectedInteraction(interaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInteraction(null)
  }

  const handleMarkAsReviewed = (id: string) => {
    markInteractionAsReviewed(id)
    setLocalInteractions(prev => 
      prev.map(i => i.id === id ? { ...i, isReviewed: true } : i)
    )
    if (selectedInteraction?.id === id) {
      setSelectedInteraction({ ...selectedInteraction, isReviewed: true })
    }
  }

  if (localInteractions.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted/50 p-3 mb-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Sin interacciones registradas</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            {title}
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {localInteractions.length} registros
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">Resumen</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Fecha</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Tipo</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Resultado</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localInteractions.map((interaction) => {
                  const TypeIcon = typeIcons[interaction.type]
                  const resultConf = resultConfig[interaction.result]
                  const ResultIcon = resultConf.icon
                  const hasMessages = interaction.chatMessages && interaction.chatMessages.length > 0

                  return (
                    <TableRow key={interaction.id} className="hover:bg-muted/20">
                      <TableCell className="py-3">
                        <div className="flex items-start gap-2 max-w-xs">
                          <div className={cn("p-1.5 rounded-lg shrink-0", resultConf.color)}>
                            <TypeIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground line-clamp-2">{interaction.summary}</span>
                            {!interaction.isReviewed && (
                              <span className="text-xs text-warning flex items-center gap-1 mt-0.5">
                                <AlertCircle className="h-3 w-3" />
                                Sin revisar
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span className="text-sm text-muted-foreground">{interaction.date}</span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {getInteractionTypeLabel(interaction.type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          resultConf.badgeColor
                        )}>
                          <ResultIcon className="h-3 w-3" />
                          {getInteractionResultLabel(interaction.result)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewChat(interaction)}
                          className={cn(
                            "gap-1.5 h-8",
                            hasMessages ? "text-primary hover:text-primary" : "text-muted-foreground"
                          )}
                        >
                          <Eye className="h-4 w-4" />
                          Ver chat
                          {hasMessages && (
                            <span className="ml-1 bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
                              {interaction.chatMessages?.length}
                            </span>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ChatModal
        interaction={selectedInteraction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onMarkAsReviewed={handleMarkAsReviewed}
      />
    </>
  )
}
