interface NotFoundProps {
  message: string;
}

export default function NotFound({ message }: NotFoundProps) {
  return (
    <div className="text-center p-4">
      <p className="text-gray-600">{message}</p>
    </div>
  );
} 