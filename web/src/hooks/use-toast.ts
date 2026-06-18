import { useToast as useToastContext, type ToastProps } from '@/components/ui/toast';

type ToastInput = Omit<ToastProps, 'variant'> & {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'destructive';
};

export function useToast() {
  const { addToast, ...rest } = useToastContext();
  const toast = ({ variant, ...props }: ToastInput) => {
    addToast({
      ...props,
      variant: variant === 'destructive' ? 'error' : (variant as ToastProps['variant']),
    });
  };
  return { toast, ...rest };
}
