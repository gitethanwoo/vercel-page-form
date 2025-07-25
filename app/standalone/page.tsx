import { MultiStepSalesForm } from "@/components/multi-step-sales-form"

export default function StandalonePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-2xl">
        <MultiStepSalesForm />
      </div>
    </div>
  )
}