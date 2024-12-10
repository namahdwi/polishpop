
interface TimelineProps {
  steps: {
    status: string;
    label: string;
    date: string;
  }[];
  currentStep: number;
}

export default function Timeline({ steps, currentStep }: TimelineProps) {
  return (
    <div className="relative">
      {steps.map((step, index) => (
        <div key={step.status} className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center
            ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'}`}>
            {index <= currentStep ? '✓' : index + 1}
          </div>
          <div className="ml-4">
            <div className="font-semibold">{step.label}</div>
            <div className="text-sm text-gray-500">{step.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 