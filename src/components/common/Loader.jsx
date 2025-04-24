import React from "react";
import classes from "../../styles/loader.module.scss";

const Loader = () => {
  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader}></div>
    </div>
  );
};

export default Loader;
