import React, { useState } from "react";
import classes from "../../styles/fridge.module.scss";
import { AiFillPlusCircle } from "react-icons/ai";
import AddIngredientModal from "./AddIngredientModal";
import { useSelector } from "react-redux";

const HeaderContainer = () => {
  const { ingredients } = useSelector((state) => state.fridge);

  const [modalData, setModalData] = useState({
    isOpen: false,
    onConfirm: () => {},
  });

  const handleAddIngredientModal = () => {
    setModalData({
      isOpen: true,
      onConfirm: () => {
        console.log("addded ");
      },
    });
  };
  return (
    <div className={classes.headerWrapper}>
      <div>Total items : {ingredients.length} </div>
      <div>
        <AiFillPlusCircle
          className={classes.plusIcon}
          onClick={handleAddIngredientModal}
        />
        <AddIngredientModal
          isOpen={modalData.isOpen}
          onConfirm={modalData.onConfirm}
          onClose={() => setModalData({ ...modalData, isOpen: false })}
        />
      </div>
    </div>
  );
};

export default HeaderContainer;
