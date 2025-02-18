import Header from "@/components/homePage/Header";
import React from "react";
import classes from "../styles/home.module.scss";
import SearchSection from "@/components/homePage/SearchSection";

const Home = () => {
  return (
    <div className={classes.mainContainer}>
      <Header />
      <SearchSection />
    </div>
  );
};

export default Home;
