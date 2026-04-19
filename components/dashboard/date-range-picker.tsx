"use client"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, parse, isValid, isBefore, isAfter, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  from: Date | undefined
  to: Date | undefined
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  className?: string
}

const DATE_FORMAT = "dd/MM/yyyy"

function parseInputDate(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  
  const parsed = parse(trimmed, DATE_FORMAT, new Date())
  if (isValid(parsed)) {
    return parsed
  }
  return null
}

function formatDateForInput(date: Date | undefined): string {
  if (!date) return ""
  return format(date, DATE_FORMAT)
}

export function DateRangePicker({ from, to, onChange, className }: DateRangePickerProps) {
  const [startInputValue, setStartInputValue] = useState(formatDateForInput(from))
  const [endInputValue, setEndInputValue] = useState(formatDateForInput(to))
  const [startCalendarOpen, setStartCalendarOpen] = useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = useState(false)
  const [startError, setStartError] = useState(false)
  const [endError, setEndError] = useState(false)

  // Sync input values when props change
  useEffect(() => {
    setStartInputValue(formatDateForInput(from))
  }, [from])

  useEffect(() => {
    setEndInputValue(formatDateForInput(to))
  }, [to])

  const validateAndUpdateRange = (newFrom: Date | undefined, newTo: Date | undefined) => {
    // Validate: start must be before or equal to end
    if (newFrom && newTo && isAfter(startOfDay(newFrom), startOfDay(newTo))) {
      return false
    }
    onChange({ from: newFrom, to: newTo })
    return true
  }

  const handleStartInputChange = (value: string) => {
    setStartInputValue(value)
    setStartError(false)
    
    if (!value.trim()) {
      validateAndUpdateRange(undefined, to)
      return
    }

    const parsed = parseInputDate(value)
    if (parsed) {
      if (to && isAfter(startOfDay(parsed), startOfDay(to))) {
        setStartError(true)
      } else {
        validateAndUpdateRange(parsed, to)
      }
    }
  }

  const handleEndInputChange = (value: string) => {
    setEndInputValue(value)
    setEndError(false)
    
    if (!value.trim()) {
      validateAndUpdateRange(from, undefined)
      return
    }

    const parsed = parseInputDate(value)
    if (parsed) {
      if (from && isBefore(startOfDay(parsed), startOfDay(from))) {
        setEndError(true)
      } else {
        validateAndUpdateRange(from, parsed)
      }
    }
  }

  const handleStartInputBlur = () => {
    const parsed = parseInputDate(startInputValue)
    if (startInputValue.trim() && !parsed) {
      setStartError(true)
      setStartInputValue(formatDateForInput(from))
    } else if (parsed && to && isAfter(startOfDay(parsed), startOfDay(to))) {
      setStartError(true)
      setStartInputValue(formatDateForInput(from))
    } else {
      setStartError(false)
    }
  }

  const handleEndInputBlur = () => {
    const parsed = parseInputDate(endInputValue)
    if (endInputValue.trim() && !parsed) {
      setEndError(true)
      setEndInputValue(formatDateForInput(to))
    } else if (parsed && from && isBefore(startOfDay(parsed), startOfDay(from))) {
      setEndError(true)
      setEndInputValue(formatDateForInput(to))
    } else {
      setEndError(false)
    }
  }

  const handleStartCalendarSelect = (date: Date | undefined) => {
    if (date) {
      if (validateAndUpdateRange(date, to)) {
        setStartInputValue(formatDateForInput(date))
        setStartError(false)
      }
    }
    setStartCalendarOpen(false)
  }

  const handleEndCalendarSelect = (date: Date | undefined) => {
    if (date) {
      if (validateAndUpdateRange(from, date)) {
        setEndInputValue(formatDateForInput(date))
        setEndError(false)
      }
    }
    setEndCalendarOpen(false)
  }

  const handleQuickSelect = (days: number) => {
    const today = new Date()
    let newFrom: Date

    if (days === 90) {
      newFrom = new Date(today)
      newFrom.setMonth(today.getMonth() - 3)
    } else {
      newFrom = new Date(today)
      newFrom.setDate(today.getDate() - days)
    }

    onChange({ from: newFrom, to: today })
    setStartInputValue(formatDateForInput(newFrom))
    setEndInputValue(formatDateForInput(today))
    setStartError(false)
    setEndError(false)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Quick Access Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => handleQuickSelect(7)}
        >
          7 dias
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => handleQuickSelect(30)}
        >
          30 dias
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => handleQuickSelect(90)}
        >
          3 meses
        </Button>
      </div>

      {/* Date Inputs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {/* Start Date */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[70px]">Fecha inicio</span>
          <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
            <div className="relative flex-1 sm:flex-initial">
              <Input
                type="text"
                placeholder="DD/MM/YYYY"
                value={startInputValue}
                onChange={(e) => handleStartInputChange(e.target.value)}
                onBlur={handleStartInputBlur}
                className={cn(
                  "w-full sm:w-[130px] pr-8 bg-card text-sm",
                  startError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
              />
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Abrir calendario fecha inicio"
                >
                  <CalendarIcon className="h-4 w-4" />
                </button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={from}
                onSelect={handleStartCalendarSelect}
                defaultMonth={from}
                locale={es}
                disabled={(date) => to ? isAfter(startOfDay(date), startOfDay(to)) : false}
              />
            </PopoverContent>
          </Popover>
        </div>

        <span className="hidden sm:block text-muted-foreground">-</span>

        {/* End Date */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[70px]">Fecha fin</span>
          <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
            <div className="relative flex-1 sm:flex-initial">
              <Input
                type="text"
                placeholder="DD/MM/YYYY"
                value={endInputValue}
                onChange={(e) => handleEndInputChange(e.target.value)}
                onBlur={handleEndInputBlur}
                className={cn(
                  "w-full sm:w-[130px] pr-8 bg-card text-sm",
                  endError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
              />
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Abrir calendario fecha fin"
                >
                  <CalendarIcon className="h-4 w-4" />
                </button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={to}
                onSelect={handleEndCalendarSelect}
                defaultMonth={to}
                locale={es}
                disabled={(date) => from ? isBefore(startOfDay(date), startOfDay(from)) : false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
