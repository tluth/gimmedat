import React, { useEffect, useState } from "react";

const styles= {
    color: "rgb(73, 247, 4)",
    fontFamily: "monospace",
    fontSize: "calc(1.1vw + 1.1vh)",
    userSelect: "all"
}
const FileLink = (props) => {
    //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
    //is set programmatically
    // trigger: "time" || "programmatical"
    const { sharing_link } = props;
    return (
        <div style={styles}>
            {sharing_link}
        </div>
    )
}

export default FileLink