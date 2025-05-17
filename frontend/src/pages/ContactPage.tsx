import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../components/ui/textarea"

import emailjs from '@emailjs/browser'

import { useState } from "react"



const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().min(3).max(320).email({ message: "Please enter a valid email address." }),
  message: z.string().min(2).max(500),
})


const ContactPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [isError, setIsError] = useState(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    emailjs
      .send(import.meta.env.VITE_EMAILJS_SERVICE_ID!, import.meta.env.VITE_EMAILJS_TEMPLATE_ID!, values, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          setIsLoading(false)
          setIsSuccessful(true)
          console.log('SUCCESS!');
        },
        (error) => {
          setIsLoading(false)
          setIsError(true)
          console.log('FAILED...', error.text);
        },
      )
  }


  return (
    <div className="flex justify-center w-[100vw] pt-12">
      <div className="sm:w-[30vw] w-[80vw] text-offWhite ">
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="text-left space-y-6">
        <div className="grid grid-cols-2 gap-6 ">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Ronny" {...field} name="firstName"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Crumpets" {...field} name="lastName"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ro_crum@gmail.com" {...field} name="email"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Go wild..." {...field} name="message"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="flex">
       {isSuccessful?<Button disabled type="submit">Submit</Button>:<Button type="submit">Submit</Button>}
       {isLoading?<div className="flex self-center pl-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> <div className="pl-2">Please wait...</div></div>:<div></div>}
       {isSuccessful?<div className="flex pl-4 text-sm self-center">Thanks, we've received your email.</div>:<div></div>}
       {isError?<div className="flex pl-4 text-sm self-center">Sorry, something's gone wrong.</div>:<div></div>}


        </div>
      </form>
    </Form>
    </div>
    </div>
  )
}

export default ContactPage
