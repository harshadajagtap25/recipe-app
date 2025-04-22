/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteIngredient,
  fetchIngredientsForDisplay,
} from "@/redux/fridgeSlice";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmationModal from "../common/ConfirmationModal";
import classes from "../../styles/fridge.module.scss";

const IngredientCard = ({ ingredient }) => {
  const dispatch = useDispatch();
  const { deleteStatus } = useSelector((state) => state.fridge);
  const { currentUser } = useAuth();
  const [pendingDelete, setPendingDelete] = useState(false);

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // Format date to DD MMM, YYYY format
  const formatDate = useCallback((dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);
    const parts = formatted.split(" ");
    return `${parts[0]} ${parts[1].replace(",", "")}, ${parts[2]}`;
  }, []);

  // Handle opening the delete confirmation modal
  const handleDeleteClick = useCallback(() => {
    setModalData({
      isOpen: true,
      title: "Delete Confirmation",
      message: `Are you sure you want to delete ${ingredient.name}? This action cannot be undone.`,
    });
  }, [ingredient.name]);

  // Handle actual deletion after confirmation
  const handleDeleteConfirm = useCallback(() => {
    const payload = {
      id: ingredient._id,
    };
    setPendingDelete(true);
    dispatch(deleteIngredient({ payload, userId: currentUser.id }));
  }, [ingredient._id, currentUser.id, dispatch]);

  // Close the modal
  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Handle successful deletion
  useEffect(() => {
    if (pendingDelete && deleteStatus === "succeeded") {
      setPendingDelete(false);
      handleCloseModal();

      dispatch(fetchIngredientsForDisplay(currentUser.id));
    }
  }, [deleteStatus, pendingDelete, dispatch, currentUser.id, handleCloseModal]);

  return (
    <div className={classes.ingredientCard}>
      <div className={classes.card1}>
        <h5 className={classes.ingredientTitle}>{ingredient.name}</h5>
        <div className={classes.ingredientDetails}>
          Quantity: {ingredient.quantity} {ingredient.unit}
        </div>
        {ingredient.category && (
          <div className={classes.ingredientDetails}>
            Category: {ingredient.category}
          </div>
        )}
        {ingredient.expiryDate && (
          <div className={classes.ingredientDetails}>
            Expiry Date: {formatDate(ingredient.expiryDate)}
          </div>
        )}
      </div>
      <div className={classes.card2}>
        <AiFillDelete
          color="#2e7d32"
          onClick={handleDeleteClick}
          aria-label={`Delete ${ingredient.name}`}
          role="button"
          tabIndex={0}
        />

        <ConfirmationModal
          isOpen={modalData.isOpen}
          title={modalData.title}
          message={modalData.message}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default React.memo(IngredientCard);
