import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { completeOnboarding } from '../lib/api';

const useOnboard = () => {

    const queryClient = useQueryClient()
  const {mutate, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile completed");
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },

    onError:(error) => {
      console.log(error.response.data.message);
      
    }
  })

  return {isPending,  onboardingMutation:mutate }
}

export default useOnboard