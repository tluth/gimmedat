import React, { useEffect, useState } from "react";


const FileLink = (props) => {
    //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
    //is set programmatically
    // trigger: "time" || "programmatical"
    const { sharing_link } = props;
    return (
        <div>
            {sharing_link}
        </div>
    )
}

export default FileLink