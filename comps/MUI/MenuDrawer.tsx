import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "../../styles/MenuDrawer.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";

export default function MenuDrawer() {
  const [show, setShow] = React.useState(false);

  function toggleDrawer() {
    setShow((show) => !show);
  }

  function onMenuItemClick(menuItem: string) {
    switch (menuItem) {
      case "account":
        console.log("Acc");
        break;
      case "upload-backup":
        console.log("upload-backup");
        break;
      case "download-backup":
        console.log("download-backup");
        break;
      case "about":
        console.log("about");
        break;
    }
  }

  return (
    <React.Fragment>
      <Button onClick={toggleDrawer} style={{ paddingLeft: "0px" }}>
        <MenuIcon sx={{ color: "#ffe81f " }} />
      </Button>
      <Drawer anchor={"right"} open={show} onClose={toggleDrawer}>
        <div className={styles.drawer}>
          <ul className={styles.menuList}>
            <li onClick={() => onMenuItemClick("account")}>
              <AccountCircleIcon /> Account
            </li>
            <li onClick={() => onMenuItemClick("upload-backup")}>
              <FileUploadIcon />
              Upload Backup
            </li>
            <li onClick={() => onMenuItemClick("download-backup")}>
              <DownloadIcon />
              Download Backup
            </li>
            <li onClick={() => onMenuItemClick("about")}>
              <InfoIcon />
              About
            </li>
          </ul>
        </div>
      </Drawer>
    </React.Fragment>
  );
}
