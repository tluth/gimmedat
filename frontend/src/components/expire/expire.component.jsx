import React, { useEffect, useState } from "react";


const Expire = (props) => {
    //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
    //is set programmatically
    // trigger: "time" || "programmatical"
    const { trigger, delay, isVisible } = props;

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (trigger === "time") {
            setTimeout(() => {
                setVisible(false);
            }, delay);
        }
    }, [props.delay]);

    useEffect(() => {
        if (trigger === "programmatical") {
            setVisible(isVisible);
        }
    }, [props.isVisible]);

    return visible ? <React.Fragment>{props.children}</React.Fragment> : null;
};

export default Expire;
