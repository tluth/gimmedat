import React, { useEffect, useState } from "react"

type ExpireProps = {
  trigger: "time" | "programmatical"
  delay?: number
  isVisible?: boolean
  children: React.ReactNode
}

const Expire = ({ trigger, delay, isVisible, children }: ExpireProps) => {
  //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
  //is set programmatically
  // trigger: "time" || "programmatical"

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (trigger === "time") {
      setTimeout(() => {
        setVisible(false)
      }, delay)
    }
  }, [delay, trigger])

  // For programmatical trigger, use the prop directly instead of syncing to state
  const shouldBeVisible = trigger === "programmatical" ? isVisible : visible

  return shouldBeVisible ? <React.Fragment>{children}</React.Fragment> : null
}

export default Expire
