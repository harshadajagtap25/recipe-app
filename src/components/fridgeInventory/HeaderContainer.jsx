import React, { useState } from "react";
import classes from "../../styles/fridge.module.scss";
import { AiFillPlusCircle } from "react-icons/ai";
import AddIngredientModal from "./AddIngredientModal";
import { useSelector } from "react-redux";

const HeaderContainer = () => {
  const { ingredients } = useSelector((state) => state.fridge);

  const [modalData, setModalData] = useState({
    isOpen: false,
  });

  const handleAddIngredientModal = () => {
    setModalData({
      isOpen: true,
    });
  };
  return (
    <div className={classes.headerWrapper}>
      {ingredients["items"] && (
        <div>Total items : {ingredients["items"].length} </div>
      )}
      <div>
        <AiFillPlusCircle
          color="#2e7d32"
          className={classes.plusIcon}
          onClick={handleAddIngredientModal}
        />
        <AddIngredientModal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ ...modalData, isOpen: false })}
        />
      </div>
    </div>
  );
};

export default HeaderContainer;
