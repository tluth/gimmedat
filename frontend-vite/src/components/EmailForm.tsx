"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { send } from "@emailjs/browser";
import { Button } from "./ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  sender: z.union([
    z.string().min(2, { message: "A Name or email is required" }).max(50),
    z.string().email(),
  ]),
  recipientEmail: z.string().email(),
});

type EmailFormProps = {
  className?: string;
  isChecked: boolean;
  recipient: string;
  sender: string;
  handleChangeRecipient: () => void;
  handleChangeSender: () => void;
};

const EmailForm = ({
  className,
  isChecked,
  recipient,
  sender,
  handleChangeRecipient,
  handleChangeSender,
}: EmailFormProps) => {
  const [isRecipient, setIsRecipient] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: "",
      recipientEmail: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const defaultStyles = `p-5 mb-5 flex flex-col text-offWhite cursor-pointer transition-border ease-in-out border-2
        rounded-lg border-dashed ${
          isChecked ? "border-main-300" : "border-offWhite"
        } overflow-hidden px-3 relative`;

  return (
    <div className={`${defaultStyles} ${className} w-full`}>
      <div className="">
          <Form {...form} >
            {" "}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={!isRecipient} onCheckedChange={() => setIsRecipient(!isRecipient)} />
                <label
                  htmlFor="terms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tick to email the download link{" "}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                <FormField
                  
                  control={form.control}
                  name="sender"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Sender name or email" disabled={isRecipient} {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Recipient email" disabled={isRecipient} {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              
              <Button type="submit" className="h-24 w-[80%] justify-self-center	" >Submit</Button>
              </div>   
            </form>
          </Form>
      </div>
    </div>
  );
};

export default EmailForm;
