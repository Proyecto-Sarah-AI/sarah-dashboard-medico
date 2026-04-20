"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  MessageSquare, 
  Send,
  Mail,
  Smartphone,
  User,
  Users,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Phone,
  CalendarClock
} from "lucide-react"
import type { Message, Caregiver, Patient, MessageChannel, MessageRecipientType } from "@/lib/mock-data"
import { getRelationshipLabel, getMessageStatusLabel, getMessageChannelLabel } from "@/lib/mock-data"

interface MessagingPanelProps {
  patient: Patient
  messages: Message[]
  caregivers: Caregiver[]
  onSendMessage?: (message: {
    recipientType: MessageRecipientType
    recipientId: string
    channel: MessageChannel
    subject: string
    content: string
    scheduledAt?: Date
  }) => void
  onOpenChat?: (patientId: string) => void
}

const messageTemplates = [
  { id: "reminder", subject: "Recordatorio de cita", content: "Le recordamos su próxima cita programada. Por favor confirme su asistencia." },
  { id: "adherence", subject: "Seguimiento de adherencia", content: "Hemos notado que la adherencia al tratamiento ha disminuido. ¿Hay algo en lo que podamos ayudarle?" },
  { id: "symptoms", subject: "Seguimiento de síntomas", content: "Queremos dar seguimiento a los síntomas que reportó recientemente. ¿Cómo se ha sentido?" },
  { id: "encouragement", subject: "Mensaje de apoyo", content: "Queremos felicitarle por su progreso en el tratamiento. Siga así!" },
  { id: "caregiver_update", subject: "Actualización de progreso", content: "Le compartimos una actualización sobre el progreso del paciente en su tratamiento." },
  { id: "caregiver_alert", subject: "Alerta importante", content: "Es importante que estén al tanto de la situación actual del paciente. Por favor comuníquense con nosotros." },
]

// Mock chat messages for demo
interface ChatMessage {
  id: string
  sender: "doctor" | "patient" | "caregiver"
  senderName: string
  content: string
  timestamp: Date
}

const mockPatientChat: ChatMessage[] = [
  { id: "c1", sender: "patient", senderName: "María García", content: "Buenos días doctor, quería preguntarle sobre la dosis del medicamento", timestamp: new Date("2024-01-15T09:30:00") },
  { id: "c2", sender: "doctor", senderName: "Dr. Juan Pérez", content: "Buenos días María. Claro, dígame en qué puedo ayudarla.", timestamp: new Date("2024-01-15T09:35:00") },
  { id: "c3", sender: "patient", senderName: "María García", content: "¿Puedo tomar el medicamento después del almuerzo en lugar de antes?", timestamp: new Date("2024-01-15T09:37:00") },
  { id: "c4", sender: "doctor", senderName: "Dr. Juan Pérez", content: "Sí, puede tomarlo después del almuerzo. Lo importante es mantener la consistencia en el horario.", timestamp: new Date("2024-01-15T09:40:00") },
]

const mockCaregiverChat: ChatMessage[] = [
  { id: "cg1", sender: "caregiver", senderName: "Roberto García (Esposo)", content: "Doctor, le escribo porque María ha tenido náuseas esta semana", timestamp: new Date("2024-01-14T14:20:00") },
  { id: "cg2", sender: "doctor", senderName: "Dr. Juan Pérez", content: "Gracias por informarme Roberto. ¿Las náuseas son constantes o solo después de tomar el medicamento?", timestamp: new Date("2024-01-14T14:25:00") },
  { id: "cg3", sender: "caregiver", senderName: "Roberto García (Esposo)", content: "Principalmente después del medicamento, como 2 horas después", timestamp: new Date("2024-01-14T14:28:00") },
  { id: "cg4", sender: "doctor", senderName: "Dr. Juan Pérez", content: "Es un efecto secundario común. Asegúrese de que tome el medicamento con alimentos. Si persiste, agendemos una cita.", timestamp: new Date("2024-01-14T14:32:00") },
]

export function MessagingPanel({ patient, messages, caregivers, onSendMessage, onOpenChat }: MessagingPanelProps) {
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatTab, setChatTab] = useState<"patient" | "caregiver">("patient")
  const [chatMessage, setChatMessage] = useState("")
  const [patientChatMessages, setPatientChatMessages] = useState<ChatMessage[]>(mockPatientChat)
  const [caregiverChatMessages, setCaregiverChatMessages] = useState<ChatMessage[]>(mockCaregiverChat)
  const [recipientType, setRecipientType] = useState<MessageRecipientType>("patient")
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [channel, setChannel] = useState<MessageChannel>("app")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [sendOption, setSendOption] = useState<"now" | "scheduled">("now")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState<string>("09:00")

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      sender: "doctor",
      senderName: "Dr. Juan Pérez",
      content: chatMessage.trim(),
      timestamp: new Date()
    }
    
    if (chatTab === "patient") {
      setPatientChatMessages(prev => [...prev, newMessage])
    } else {
      setCaregiverChatMessages(prev => [...prev, newMessage])
    }
    setChatMessage("")
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId)
    if (template) {
      setSubject(template.subject)
      setContent(template.content)
    }
    setSelectedTemplate(templateId)
  }

  const handleSend = () => {
    if (!selectedRecipient || !subject.trim() || !content.trim()) return
    if (sendOption === "scheduled" && !scheduledDate) return
    
    let scheduledAt: Date | undefined = undefined
    if (sendOption === "scheduled" && scheduledDate) {
      const [hours, minutes] = scheduledTime.split(":").map(Number)
      scheduledAt = new Date(scheduledDate)
      scheduledAt.setHours(hours, minutes, 0, 0)
    }
    
    onSendMessage?.({
      recipientType,
      recipientId: selectedRecipient,
      channel,
      subject: subject.trim(),
      content: content.trim(),
      scheduledAt
    })
    
    setIsComposeOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setRecipientType("patient")
    setSelectedRecipient("")
    setChannel("app")
    setSubject("")
    setContent("")
    setSelectedTemplate("")
    setSendOption("now")
    setScheduledDate(undefined)
    setScheduledTime("09:00")
  }

  const patientMessages = messages.filter(m => m.recipientType === "patient")
  const caregiverMessages = messages.filter(m => m.recipientType === "caregiver")

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent": return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered": return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read": return <CheckCheck className="h-3 w-3 text-success" />
      case "failed": return <AlertCircle className="h-3 w-3 text-destructive" />
    }
  }

  const getChannelIcon = (ch: MessageChannel) => {
    switch (ch) {
      case "app": return <MessageSquare className="h-3 w-3" />
      case "sms": return <Smartphone className="h-3 w-3" />
      case "email": return <Mail className="h-3 w-3" />
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Mensajería
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Chat Button */}
            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg h-[500px] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat en vivo
                  </DialogTitle>
                  <DialogDescription>
                    Comunícate directamente con el paciente o su red de apoyo.
                  </DialogDescription>
                </DialogHeader>
                <Tabs value={chatTab} onValueChange={(v) => setChatTab(v as "patient" | "caregiver")} className="flex-1 flex flex-col">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="patient" className="text-xs gap-1">
                      <User className="h-3 w-3" />
                      Paciente
                    </TabsTrigger>
                    <TabsTrigger value="caregiver" className="text-xs gap-1">
                      <Users className="h-3 w-3" />
                      Red de apoyo
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="patient" className="flex-1 flex flex-col mt-3">
                    <ScrollArea className="flex-1 h-[280px] pr-3">
                      <div className="space-y-3">
                        {patientChatMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                msg.sender === "doctor" 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.sender === "doctor" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {msg.timestamp.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="caregiver" className="flex-1 flex flex-col mt-3">
                    {caregivers.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                        <div className="text-center">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          No hay red de apoyo registrada
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="flex-1 h-[280px] pr-3">
                        <div className="space-y-3">
                          {caregiverChatMessages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                  msg.sender === "doctor" 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted"
                                }`}
                              >
                                {msg.sender !== "doctor" && (
                                  <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-xs mt-1 ${msg.sender === "doctor" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {msg.timestamp.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
                
                {/* Chat Input */}
                <div className="flex gap-2 pt-3 border-t">
                  <Input
                    placeholder={chatTab === "patient" ? `Escribe a ${patient.name}...` : "Escribe a la red de apoyo..."}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendChatMessage()}
                    disabled={chatTab === "caregiver" && caregivers.length === 0}
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendChatMessage}
                    disabled={!chatMessage.trim() || (chatTab === "caregiver" && caregivers.length === 0)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Schedule Message Button */}
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                Programar mensaje
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Programar Mensaje</DialogTitle>
                <DialogDescription>
                  Envíe un mensaje ahora o prográmelo para más tarde.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Recipient Type */}
                <div className="space-y-2">
                  <Label>Tipo de destinatario</Label>
                  <Select 
                    value={recipientType} 
                    onValueChange={(v) => {
                      setRecipientType(v as MessageRecipientType)
                      setSelectedRecipient("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Paciente
                        </div>
                      </SelectItem>
                      <SelectItem value="caregiver">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Red de apoyo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipient Selection */}
                <div className="space-y-2">
                  <Label>Destinatario</Label>
                  {recipientType === "patient" ? (
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={patient.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {patient.name}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar familiar/cuidador" />
                      </SelectTrigger>
                      <SelectContent>
                        {caregivers.length === 0 ? (
                          <SelectItem value="" disabled>
                            No hay cuidadores registrados
                          </SelectItem>
                        ) : (
                          caregivers.map(cg => (
                            <SelectItem key={cg.id} value={cg.id}>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {cg.name} ({getRelationshipLabel(cg.relationship)})
                                {cg.isPrimary && <Badge variant="secondary" className="text-xs ml-1">Principal</Badge>}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Channel Display (locked to app) */}
                <div className="space-y-2">
                  <Label>Canal de envío</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-muted text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Aplicación</span>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label>Plantilla (opcional)</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plantilla..." />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTemplates.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Asunto</Label>
                  <Input 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Asunto del mensaje"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Mensaje</Label>
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escriba su mensaje aquí..."
                    rows={4}
                  />
                </div>

                {/* Send Options */}
                <div className="space-y-3 pt-3 border-t">
                  <Label>Opciones de envío</Label>
                  <RadioGroup 
                    value={sendOption} 
                    onValueChange={(value) => setSendOption(value as "now" | "scheduled")}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="send-now" />
                      <Label htmlFor="send-now" className="font-normal cursor-pointer">
                        Enviar ahora
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="send-scheduled" />
                      <Label htmlFor="send-scheduled" className="font-normal cursor-pointer">
                        Programar para después
                      </Label>
                    </div>
                  </RadioGroup>

                  {sendOption === "scheduled" && (
                    <div className="flex gap-3 pl-6">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[180px] justify-start text-left font-normal"
                          >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-[120px]"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSend} 
                  disabled={!selectedRecipient || !subject.trim() || !content.trim() || (sendOption === "scheduled" && !scheduledDate)}
                >
                  {sendOption === "now" ? (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar ahora
                    </>
                  ) : (
                    <>
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Programar envío
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-3">
            <TabsTrigger value="patient" className="text-xs gap-1">
              <User className="h-3 w-3" />
              Paciente ({patientMessages.length})
            </TabsTrigger>
            <TabsTrigger value="caregivers" className="text-xs gap-1">
              <Users className="h-3 w-3" />
              Red de apoyo ({caregiverMessages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <MessageList messages={patientMessages} getStatusIcon={getStatusIcon} getChannelIcon={getChannelIcon} />
          </TabsContent>

          <TabsContent value="caregivers">
            {caregivers.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No hay red de apoyo registrada
              </div>
            ) : (
              <>
                {/* Caregivers List */}
                <div className="mb-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Contactos registrados:</p>
                  <div className="flex flex-wrap gap-2">
                    {caregivers.map(cg => (
                      <Badge key={cg.id} variant="outline" className="text-xs flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {cg.name}
                        <span className="text-muted-foreground">({getRelationshipLabel(cg.relationship)})</span>
                        {cg.isPrimary && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-1">Principal</Badge>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="my-3" />
                <MessageList messages={caregiverMessages} getStatusIcon={getStatusIcon} getChannelIcon={getChannelIcon} />
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Message List Component
function MessageList({ 
  messages, 
  getStatusIcon, 
  getChannelIcon 
}: { 
  messages: Message[]
  getStatusIcon: (status: Message["status"]) => React.ReactNode
  getChannelIcon: (channel: MessageChannel) => React.ReactNode
}) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No hay mensajes enviados
      </div>
    )
  }

  return (
    <ScrollArea className="h-[250px]">
      <div className="space-y-3 pr-3">
        {messages.map((message) => (
          <div key={message.id} className="p-3 rounded-lg border border-border bg-muted/30">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getChannelIcon(message.channel)}
                <span className="font-medium text-sm text-foreground">{message.subject}</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(message.status)}
                <span className="text-xs text-muted-foreground">{getMessageStatusLabel(message.status)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Para: {message.recipientName}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(message.sentAt).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
