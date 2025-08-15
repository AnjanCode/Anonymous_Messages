'use client';
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

const page = () => {
    const params = useParams<{username : string}>()
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver : zodResolver(messageSchema)
    })
    const [isLoading, setIsLoading] = useState(false);
    const username = params.username;
    const messageContent = form.watch('content')
    const onSubmit = async (data : z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username
            })
            toast(response.data.message)
            form.reset({...form.getValues(), content : ''})
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message || "Failed to send message")
        } finally {
            setIsLoading(false);
        }
    }
    return (
    <div className="flex justify-center items-center min-h-screen bg-grey-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Profile Link
          </h1>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page;