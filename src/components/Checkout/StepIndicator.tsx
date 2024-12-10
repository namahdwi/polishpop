interface StepIndicatorProps {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}

export function StepIndicator({ number, title, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${active ? 'bg-primary text-white' : 
          completed ? 'bg-green-500 text-white' : 
          'bg-gray-200 text-gray-600'}
      `}>
        {number}
      </div>
      <span className={`ml-2 ${active ? 'text-primary font-medium' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
} 