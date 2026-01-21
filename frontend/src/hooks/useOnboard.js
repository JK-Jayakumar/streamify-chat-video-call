import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { completeOnboarding } from '../lib/api';
import toast, { Toaster } from 'react-hot-toast'


const useOnboard = () => {

    const queryClient = useQueryClient()
  const {mutate, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile completed");
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
      console.error("Onboarding Error:", error);
    },
  })

  return {isPending,  onboardingMutation:mutate }
}

export default useOnboard