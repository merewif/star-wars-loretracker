import React, { useState, forwardRef } from "react";
import styles from "../styles/Header.module.css";
import logo from "../assets/logo.png";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { style } from "@mui/system";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header = ({ displayData, handleFileRead }) => {
  const listElements = ["Movies", "Books", "Comics", "Series"];
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function uploadBackup(event) {
    let reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = handleFileRead;
  }

  function downloadBackup() {
    let collection = JSON.parse(localStorage.getItem("loretracker")) ?? {};
    let collectionAsText = JSON.stringify(collection);

    let a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(collectionAsText)
    );
    a.setAttribute("download", "my-star-wars-loretracker-collection.sw");
    a.click();
  }

  return (
    <>
      <nav id={styles.navbar}>
        <div id={styles.image}>
          <Image src={logo} alt="Logo" height={100} width={150} />
        </div>
        <ul>
          {listElements.map((e, i) => {
            return (
              <li
                onClick={(e) => displayData(e.target.id)}
                key={i}
                id={listElements[i].toLowerCase()}
                className="navbtn"
              >
                {listElements[i]}
              </li>
            );
          })}

          <li onClick={handleClickOpen}>About & Backup</li>
        </ul>
      </nav>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ maxHeight: "none", maxWidth: "none" }}
      >
        <div className={styles.dialogContent}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Image src={logo} alt="Logo" height={200} width={300} />
          <p>
            The site was developed using React and Next.js. The repository is
            available
            <a
              href="https://github.com/merewif/star-wars-loretracker"
              target="_blank"
              rel="noopener noreferrer"
            >
              here.
            </a>{" "}
            For feedback and bug reports kindly use the GitHub issues feature.
            Pull requests are welcome.
          </p>
          <p>
            The databases for the Star Wars books and comics were assembled by{" "}
            <a
              href="https://youtini.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              the Youtini team.
            </a>
          </p>
          <p>
            The Loretracker is a serverless application; your collection data is
            stored in your browser. If you want to import or export your
            collection, use the buttons below:
          </p>
          <div style={{ display: "grid", gap: "10px" }}>
            <input
              onChange={uploadBackup}
              type="file"
              hidden
              id="upload-backup"
            />
            <label htmlFor="upload-backup">
              <Button
                component="span"
                variant="outlined"
                startIcon={<FileUploadIcon />}
                sx={{
                  color: "white",
                  borderColor: "white",
                  padding: "10px",
                  minWidth: "100px",
                  height: "2.5rem",
                  marginBlock: "auto",
                  width: "100%",
                }}
              >
                Upload backup
              </Button>
            </label>
            <Button
              onClick={downloadBackup}
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                color: "white",
                borderColor: "white",
                padding: "10px",
                minWidth: "100px",
                height: "2.5rem",
                marginBlock: "auto",
              }}
            >
              Download backup
            </Button>
          </div>
          <p>
            Star Wars Loretracker is not affiliated, associated, authorized,
            endorsed by, or in any way officially connected with STAR WARS,
            Lucasfilm Ltd., The Walt Disney Company, Disney Enterprises Inc., or
            any of its subsidiaries or its affiliates. The official Star Wars
            website is available at{" "}
            <a
              href="http://www.starwars.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.starwars.com
            </a>
            . All Star Wars artwork, logos & properties belong to ©Lucasfilm LTD
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default Header;

//  <ThemeSwitcher />
