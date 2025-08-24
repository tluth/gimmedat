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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  sender: z.string().min(2, { message: "A Name or email is required" }).max(50),
  recipient: z.string().email(),
})

type EmailFormProps = {
  className?: string
  isChecked: boolean
  setIsChecked: (isChecked: boolean) => void
  handleSubmit: (values: z.infer<typeof formSchema>) => void
}

const EmailForm = ({
  className,
  isChecked,
  setIsChecked,
  handleSubmit,
}: EmailFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: isChecked ? zodResolver(formSchema) : undefined,
    defaultValues: {
      sender: "",
      recipient: "",
    },
  })



  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit(values)
  }

  const defaultStyles = `py-1 justify-center sm:justify-between text-offWhite overflow-hidden relative flex w-full flex-col sm:flex-row`

  return (
    <div className={`${defaultStyles} ${className}`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <div className="sm:grid grid-cols-2 w-full gap-4">
            <div
              className={`transition-border ease-in-out border-2 rounded border-dashed w-full p-4 space-y-2 sm:space-y-5  sm:m-5${
                isChecked ? "border-main-300" : "border-offWhite"
              }`}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={() => setIsChecked(!isChecked)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tick to email the download link automatically
                </label>
              </div>
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Sender name or email"
                        disabled={!isChecked}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Recipient email"
                        disabled={!isChecked}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="ml-0 sm:ml-5 mt-5 sm:mt-0 h-10 min-w-24 sm:min-w-32 max-w-64 w-[100%] rounded col-span-1 justify-self-end"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>

  )
}

export default EmailForm
