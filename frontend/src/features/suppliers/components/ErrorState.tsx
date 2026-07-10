import { Alert, Button } from '@mui/material';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Ocurrió un error al cargar los datos',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Reintentar
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
}
