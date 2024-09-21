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

const formSchema = z.object({
  sender: z.union([z.string().min(2, { message: "A Name or email is required" }).max(50), z.string().email()]),
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const defaultStyles = `p-5 mb-5 flex flex-col text-offWhite cursor-pointer transition-border ease-in-out border-2
        rounded-lg border-dashed ${
          isChecked ? "border-main-300" : "border-offWhite"
        } overflow-hidden px-3 relative`;

  return (
    <div className={`${defaultStyles} ${className} w-full`}>
      <div className="">
        <div className="text-sm pb-2 text-offWhite">
          Would you like to email the download link?
        </div>
        <div className="flex flex-col justify-between gap-2">
          <Button onClick={() => setIsRecipient(!isRecipient)} className="p2">
            Add recipient details
          </Button>
          {isRecipient ? (
            <Form {...form}>
              {" "}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="sender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-left">Sender name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane@gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                  
                />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          ) : (
            <div />
          )}
          {!isRecipient ? <Button>Continue without recipient</Button> : <div />}
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
