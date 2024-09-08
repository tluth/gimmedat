import React, { useEffect, useState } from "react";
import { z } from "zod"
import { Input } from "@/components/ui/input"

type EmailFormProps = {
    className?: string
    isChecked: boolean
    recipient: string
    sender: string
    handleChangeRecipient: () => void
    handleChangeSender: () => void
};

const EmailForm = ({
    className,
    isChecked,
    recipient,
    sender,
    handleChangeRecipient,
    handleChangeSender }: EmailFormProps) => {

    const defaultStyles = `p-5 flex flex-col text-offWhite cursor-pointer transition-border ease-in-out border-2
        rounded-lg border-dashed ${isChecked ? "border-main-300" : "border-offWhite"} overflow-hidden px-3 relative`

    return (
        <div className={`${defaultStyles} ${className}`}
        >
            <Input
                name="recipient-email"
                aria-label="recipient-email"
                placeholder="ro_crum@gmail.com"
                value={recipient}
            />
        </div>
    )

}

export default EmailForm