import React, { useState } from 'react';
import { ShipWheelIcon} from "lucide-react";
import { Link } from 'react-router';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { axiosInstance } from '../lib/axios';
import { signup } from '../lib/api';
import useSignUp from '../hooks/useSignUp';

const SignupPage = () => {

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  // const {mutate: signupMutation, isPending, error} = useMutation({
  //   mutationFn: signup,
  //   onSuccess:() => queryClient.invalidateQueries({ queryKey: ["authUser"] }),

  //   onError:(error) => {
  //     console.log(error.response.data.message);
  //   }
  // });

  const {isPending, error, signupMutation} = useSignUp()

  const handleSignup = (e) =>{
    e.preventDefault()
    signupMutation(signupData)
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-thema="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
       
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className="size -9 text-primary" />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-tr from-primary to-secondary tracking-wider'>
              Livly
            </span>
          </div>

          {/* {error && (
          <div className='alert alert-error mb-4'>
            <span>{error.response.data.message}</span>
          </div>)} */}

          <div className='w-full'>
            <form onSubmit={handleSignup}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'> Create an Account </h2>
                  <p className='text-sm opacity-70'>
                    Join Livly and start your language learning adventure!
                  </p>
                </div>
                <div className='space-y-3'>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input 
                    placeholder='Your FullName'
                    type='text'
                    className='input input-bordered w-full'
                    value={signupData.fullName}
                    onChange={(e)=> setSignupData({...signupData, fullName: e.target.value})}
                    required
                    />
                  </div>

                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input 
                    placeholder='Your Email'
                    type='Email'
                    className='input input-bordered w-full'
                    value={signupData.email}
                    onChange={(e)=> setSignupData({...signupData, email: e.target.value})}
                    required
                    />
                  </div>

                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input 
                    placeholder='Your Password'
                    type='password'
                    className='input input-bordered w-full'
                    value={signupData.password}
                    onChange={(e)=> setSignupData({...signupData, password: e.target.value})}
                    required
                    />
                    <p className='text-xs opacity-70 mt-1'>
                      Password must be at 6 characters long
                    </p>
                  </div>

                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type='checkbox' className='checkbox checkbox-sm' required />
                      <span className='text-xs leading-tight'>
                        I agree to the {" "}
                        <span className='text-primary hover:underline'>terms of services</span> and {" "}
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? (
                    <div>
                      <span className='loading loading-spinner loading-xs'></span>  Loading ...
                    </div>
                  ) : ( "Create Account" )}
                </button>

                <div className='text-primary mt-4'>
                    <p className="text-sm flex items-center justify-center">
                    Already have an account?
                    <Link to="/login" className="ml-1 text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>


              </div>
            </form>
          </div>
          
        </div>

        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className='relative acpect-sqare max-w-sm mx-auto'>
              <img src='Video_call.png' alt='langauage connection illustration' className='w-full h-full' />
            </div>
            <div className='text-center space-y-3 mt-6'>
            <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
            <p className='opacity-70'>
              Practice conversations, make friends,. and improve your language skills togather
            </p>
          </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignupPage