import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface AskTeamModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onStartPlan: (message: string, recommendedAgent?: 'sofia' | 'marcus' | 'luna') => void
}

type AgentReply = { agent_id: 'sofia' | 'marcus' | 'luna'; agent_name: string; response: string }

export function AskTeamModal({ open, onOpenChange, onStartPlan }: AskTeamModalProps) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [curated, setCurated] = useState<{ summary: string; steps: string[]; disagreements?: string[]; recommended_agent?: 'sofia' | 'marcus' | 'luna' } | null>(null)
  const [agents, setAgents] = useState<AgentReply[]>([])

  const askTeam = async () => {
    const q = question.trim()
    if (!q) return
    setLoading(true)
    setCurated(null)
    setAgents([])
    try {
      const res = await fetch('http://localhost:8000/api/team/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      if (!res.ok) throw new Error('Failed to ask team')
      const data = await res.json()
      setCurated(data.curated)
      setAgents(data.agents)
    } catch (e) {
      toast.error('Unable to ask the team right now. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const canStart = !!curated?.summary

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> Ask OwlNudge Team
          </DialogTitle>
          <DialogDescription>
            Ask your financial advisors (Sofia, Marcus, and Luna) and get a personalized plan.
          </DialogDescription>
        </DialogHeader>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="e.g., How do I build credit with limited income?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askTeam()}
            disabled={loading}
          />
          <Button onClick={askTeam} disabled={loading || !question.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
          </Button>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[60vh] mt-4 pr-4">
          {curated && (
            <div className="space-y-4">
              <div className="rounded-xl border p-4 bg-white">
                <div className="text-xs font-semibold text-indigo-600 mb-1">Your team’s plan</div>
                <p className="text-slate-800 mb-3">{curated.summary}</p>
                {curated.steps?.length > 0 && (
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    {curated.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                )}
                {curated.disagreements && curated.disagreements.length > 0 && (
                  <div className="mt-3 text-sm">
                    <div className="text-slate-500 font-medium mb-1">Where perspectives differed:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {curated.disagreements.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4">
                  <Button
                    onClick={() => onStartPlan(curated.summary, curated.recommended_agent)}
                    className="inline-flex items-center gap-2"
                  >
                    Start with this plan <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border bg-white">
                <Accordion type="single" collapsible>
                  {agents.map((a) => (
                    <AccordionItem value={a.agent_id} key={a.agent_id}>
                      <AccordionTrigger className="px-4">{a.agent_name}’s perspective</AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-slate-700 whitespace-pre-wrap">
                        {a.response}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
          {!curated && !loading && (
            <div className="text-sm text-slate-500 mt-2">Ask a question to see your team’s plan.</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
