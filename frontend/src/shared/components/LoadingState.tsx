import { Box, Skeleton } from '@mui/material';

interface LoadingStateProps {
  count?: number;
  height?: number;
}

export function LoadingState({ count = 5, height = 52 }: LoadingStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={height} animation="wave" />
      ))}
    </Box>
  );
}
