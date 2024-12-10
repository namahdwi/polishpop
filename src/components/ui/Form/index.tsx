import React from 'react';
import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { cn } from '../../../utils/cn';

interface FormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </form>
  );
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  children: React.ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  children,
}: FormFieldProps<T>) {
  const {
    formState: { errors },
  } = useForm<T>();

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {children}
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  );
} 