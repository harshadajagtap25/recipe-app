/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import classes from "../../styles/fridge.module.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import ConfirmationModal from "../common/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteIngredient, fetchIngredients } from "@/redux/fridgeSlice";

const IngredientCard = ({ ingredient }) => {
  const dispatch = useDispatch();
  const { deleteStatus } = useSelector((state) => state.fridge);
  const prevDeleteStatus = useRef(deleteStatus);

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // const handleEditClick = () => {
  //   console.log("Edit clicked");
  // };

  const handleDeleteClick = () => {
    setModalData({
      isOpen: true,
      title: "Delete Confirmation",
      message: `Are you sure you want to delete ${ingredient["name"]}? This action cannot be undone.`,
      onConfirm: handleDeleteConfirm(),
    });
  };

  const handleDeleteConfirm = () => () => {
    const payload = {
      id: ingredient["_id"],
    };
    dispatch(deleteIngredient(payload));
  };

  useEffect(() => {
    if (
      prevDeleteStatus.current === "loading" &&
      deleteStatus === "succeeded"
    ) {
      setModalData({ ...modalData, isOpen: false });

      dispatch(fetchIngredients());
    }
    prevDeleteStatus.current = deleteStatus;
  }, [deleteStatus, dispatch]);

  return (
    <div className={classes.ingredientCard}>
      <div className={classes.card1}>
        <h5 className={classes.ingredientTitle}>{ingredient["name"]}</h5>
        <div className={classes.ingredientDetails}>
          Quantity : {ingredient["quantity"]} {ingredient["unit"]}
        </div>
      </div>
      <div className={classes.card2}>
        {/* <AiFillEdit onClick={handleEditClick} /> */}
        <AiFillDelete onClick={handleDeleteClick} />

        <ConfirmationModal
          isOpen={modalData.isOpen}
          title={modalData.title}
          message={modalData.message}
          onConfirm={modalData.onConfirm}
          onClose={() => setModalData({ ...modalData, isOpen: false })}
        />
      </div>
    </div>
  );
};

export default IngredientCard;
