"use client";

import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { signUpSchema } from "@/schema/signUpSchema";
import { useEffect } from "react";
import axios from "axios";
import { set } from "mongoose";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sigInschema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {

 
 
  const toast = useToast();
  const router = useRouter();
  // zod implementation
  const form = useForm({
    resolver: zodResolver(sigInschema), // <z.infer<typeof signUpSchema>>
    defaultValues: {
      

      identifier: "",
      password: "",
    },
  });
  
  const onSubmit = async (data:any) => {
    console.log("dwsdsd",data);
   const result= await signIn("credentials", {
    redirect: false,
      identifier:data.identifier,
      password:data.password,
    })
    ;
    console.log(result);
    if(result?.error) {
      toast.toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
    if(result?.url) {
      router.replace("/dashboard");
    }
    
    
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sign In to Your Account
      </h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          
           <FormField
          control={form.control}
          name="identifier" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email </FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
                
                
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
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field}
                
                 />
                
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Sign In
        </Button>
        </form>
      
      </Form>
      </div>
    </div>
  );
};

export default page;
