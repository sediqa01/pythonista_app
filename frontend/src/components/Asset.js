import React from "react";
import Spinner  from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

const Asset = ({ spinner, src, message, icon }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="grow" className={styles.Spinner} />}
      {src && <img src={src} alt={message}  width={100} height={100}/>}
      {message && <p className={`${styles.text}`}>{message}</p>}
      {icon && <i className={`${styles.Icon} ${icon} p-3 p-md-4`}></i>}
    </div>
  );
};

export default Asset;