import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import Tooltip from "@mui/material/Tooltip";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListOfExcludedEntriesDialog({
  removeFromExcluded,
  entriesMarkedAsExcluded,
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ color: "white", margin: "15px", marginLeft: "20px" }}
      >
        Edit excluded entries
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div
          style={{
            backgroundColor: "black",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <DialogTitle
            sx={{
              textTransform: "uppercase",
              fontFamily: "Montserrat",
              color: "black",
              fontWeight: 900,
              paddingTop: "40px",
              textAlign: "center",
              color: "#ffe81f",
            }}
          >
            {"Excluded content"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {Object.keys(entriesMarkedAsExcluded).map((e1, i1) => {
                return (
                  <div key={i1}>
                    <h3
                      style={{
                        textTransform: "uppercase",
                        fontFamily: "Montserrat",
                        color: "#ffe81f",
                      }}
                    >
                      {e1}
                    </h3>
                    {entriesMarkedAsExcluded[e1].length ? (
                      entriesMarkedAsExcluded[e1].map((e2, i2) => {
                        return (
                          <div
                            key={i2}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              minWidth: "50vw",
                            }}
                          >
                            <Tooltip title="Remove from excluded entries">
                              <DoDisturbOnIcon
                                sx={{
                                  color: "red",
                                  fontSize: "1rem",
                                  marginRight: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeFromExcluded(e1, e2)}
                              />
                            </Tooltip>
                            <p
                              style={{
                                color: "white",
                                fontFamily: "Montserrat",
                                marginBlock: "0",
                              }}
                            >
                              {e2.replace(/-+/g, " ").replace(/—/g, "-")}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: "50vw",
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                            fontFamily: "Montserrat",
                            marginBlock: "0",
                          }}
                        >
                          Nothing excluded yet.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </DialogContentText>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
