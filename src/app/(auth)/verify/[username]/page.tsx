'use client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const page = () => {
    const router = useRouter();
    const params = useParams<{username : string}>();

    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver : zodResolver(verifyCodeSchema)
    })

    const onSubmit = async (data : z.infer<typeof verifyCodeSchema>) => {
        try {
            const response = await axios.post<ApiResponse>('/api/verify-code', {
                username : params.username,
                code : data.code
            })
            toast(response.data.message)
            if (response.data.success) {
              router.replace(`/dashboard`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message || "Failed to verify code")
        }
    }
    return (
    <div className="flex justify-center items-center min-h-screen bg-grey-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="w-40">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;