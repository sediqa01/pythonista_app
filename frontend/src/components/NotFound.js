import React from "react";
import NotFoundImage from "../assets/notFound.png";
import styles from "../styles/NotFound.module.css";
import Asset from "./Asset";

const NotFound = () => {
    return (
        <div className={styles.NotFound}>
            <Asset
                src={NotFoundImage}
                message={`Sorry, the page you're looking for doesn't exist :(`}
            />
        </div>
    );
};

export default NotFound;