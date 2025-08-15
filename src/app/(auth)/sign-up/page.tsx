'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceCallback } from 'usehooks-ts'
import z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [IsSubmitting, setIsSubmitting] = useState(false)
    const [IsChecking, setIsChecking] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver : zodResolver(signUpSchema),
        defaultValues : {
            username : "",
            email : "",
            password : ""
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsChecking(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "unexpected error")
                } finally {
                    setIsChecking(false)
                }
            }
        }
        checkUsernameUnique();
    }, [username])


    const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast(response.data.message);
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message)
            setIsSubmitting(false)
        }
    }


    return (
    <div className='flex justify-center items-center min-h-screen bg-grey-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join Mystery Message
          </h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="phil solt" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                  }}
                  />
                </FormControl>
                {IsChecking && <Loader2 className='animate-spin'/>}
                <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                  *{usernameMessage}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="abc@something.com" 
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="12345" 
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            <Button type='submit' disabled={IsSubmitting} className='w-48'>
              {
                IsSubmitting ? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait
                  </>
                ) : ('Signup')
              }
            </Button>
          </div>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member?{' '}
            <Link href={'/sign-in'} className='text-blue-600 hover:text-blue-800'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    
  )
}

export default page;