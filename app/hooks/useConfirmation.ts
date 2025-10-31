/**
 * Custom hook for managing confirmation dialogs
 * Provides a reusable pattern for confirmation dialogs across the application
 */

import { useCallback, useState } from 'react';

interface ConfirmationState<T = unknown> {
  open: boolean;
  data: T | null;
  loading: boolean;
  title?: string;
  description?: string;
}

interface UseConfirmationProps<T> {
  onConfirm: (data: T) => Promise<void>;
  title?: string;
  description?: string | ((data: T) => string);
}

export function useConfirmation<T = unknown>({
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?'
}: UseConfirmationProps<T>) {
  const [state, setState] = useState<ConfirmationState<T>>({
    open: false,
    data: null,
    loading: false
  });

  const showConfirmation = useCallback((
    data: T,
    customTitle?: string,
    customDescription?: string
  ) => {
    setState({
      open: true,
      data,
      loading: false,
      title: customTitle || title,
      description: customDescription || 
        (typeof description === 'function' ? description(data) : description)
    });
  }, [title, description]);

  const hideConfirmation = useCallback(() => {
    setState(prev => ({ ...prev, open: false, loading: false }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!state.data) return;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await onConfirm(state.data);
      hideConfirmation();
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [state.data, onConfirm, hideConfirmation]);

  return {
    ...state,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
}