export const styles = {
  dropzone: {
    textAlign: "center",
    padding: "7%",
    backgroundColor: "white",
    color: "black",
    cursor: "pointer",
    transition: "border .35s ease-in-out",
    borderWidth: "4px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    // paddingLeft: "8px",
  },
  dropZoneText: {
    fontSize: `0.8rem`,
    // opacity: `0.6`,
    color: "white",
  },
  active: {
    // Styles when dragging over
    borderColor: "rgb(73, 247, 4)",
    backgroundColor: "#eceff1",
  },
  accept: {
    // Styles when the drop will be accepted
    borderColor: "#00e676",
  },
  reject: {
    // Styles when the drop will be rejected
    borderColor: "#ff1744",
  },
  filename: {
    color: "rgb(73, 247, 4)",
  },
};
