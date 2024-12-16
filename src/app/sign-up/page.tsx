"use client";

// }
import React, { useState } from "react";
import { useDebounceValue,useDebounceCallback } from "usehooks-ts";
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

const page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isusernameMessage, setIsusernameMessage] = useState("");
  const [value,setValue]=useState("");
  const debounced = useDebounceCallback(setUsername, 300);
  const toast = useToast();
  const router = useRouter();
  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema), // <z.infer<typeof signUpSchema>>
    defaultValues: {
      username: "",

      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const isUsernameAvailable = async () => {
      if (username) {
        setIsusernameMessage("");
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/username-unique?username=${username}`
          );
          setIsusernameMessage(response.data.message);
        } catch (error) {
          setIsusernameMessage("Error checking username");
        } finally {
          setLoading(false);
        }
      }
    };
    isUsernameAvailable();
  }, [username  ]);

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    setLoading(true);
    try {
      const response = await axios.post("/api/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSuccess(true);
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Signup Error:", error);
      setIsusernameMessage("Error signing in");
    } finally {
      setLoading(false);
    }
  };
  console.log(username)
  return (
    <div className="flex justify-center bg-gray-400 min-h-screen items-center">
    
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Join the Anonymous Message Community</h1>
      <Form {...form}>
        <div className="items-center align-middle">
        <form onSubmit={form.handleSubmit(onSubmit)} className="item-center ">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    onChange={(e) => {
                      debounced(e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>

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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field}
                
                 />
                
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={loading}>
          Sign up
        </Button>
        </form>
        </div>
      </Form>
    </div>
    </div>
  );
};

export default page;
