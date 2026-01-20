import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { signup } from '../lib/api';

const useSignUp = () => {

    const queryClient = useQueryClient();

   const {mutate, isPending, error} = useMutation({
      mutationFn: signup,
      onSuccess:() => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  
      onError:(error) => {
        console.log(error.response.data.message);
      }
    });

    return {isPending, error, signupMutation:mutate}
}

export default useSignUp