import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "./ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  sender: z.union([
    z.string().min(2, { message: "A Name or email is required" }).max(50),
    z.string().email(),
  ]),
  recipientEmail: z.string().email(),
})

type EmailFormProps = {
  className?: string
  isChecked: boolean
  setIsChecked: (isChecked: boolean) => void
  recipient: string | undefined
  sender: string | undefined
  handleChangeRecipient: (value: string) => void
  handleChangeSender: (value: string) => void
  handleSubmit: () => void
}

const EmailForm = ({
  className,
  isChecked,
  setIsChecked,
  recipient,
  sender,
  handleChangeRecipient,
  handleChangeSender,
  handleSubmit
}: EmailFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: isChecked ? zodResolver(formSchema) : undefined,
    defaultValues: {
      sender: "",
      recipientEmail: "",
    },
  })

  // Handle input field changes
  const updateSender = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      handleChangeSender(newValue)  // Update local state
  }
  const updateRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      handleChangeRecipient(newValue)  // Update local state
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const defaultStyles = `p-5 mb-5 flex flex-col text-offWhite transition-border ease-in-out border-2
        rounded-lg border-dashed ${
          isChecked ? "border-main-300" : "border-offWhite"
        } overflow-hidden px-3 relative`

  return (
    <div className={`${defaultStyles} ${className} w-full`}>
      <div className="">
          <Form {...form} >
            {" "}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id="terms" checked={isChecked} onCheckedChange={() => setIsChecked(!isChecked)} />
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
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Sender name or email" disabled={!isChecked} onChange={updateSender} value={sender}/>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Recipient email" disabled={!isChecked} onChange={updateRecipient} value={recipient}/>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              
              <Button type="submit" className="h-10 w-[50%] justify-self-end" onClick={handleSubmit}>Submit</Button>
              </div>   
            </form>
          </Form>
      </div>
    </div>
  )
}

export default EmailForm
