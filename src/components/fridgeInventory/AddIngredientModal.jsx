import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import classes from "../../styles/fridge.module.scss";
import {
  addIngredient,
  fetchIngredients,
  resetAddError,
} from "@/redux/fridgeSlice";
import { useDispatch, useSelector } from "react-redux";

const AddIngredientModal = ({ isOpen, onClose, onConfirm }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    ingredientName: "",
    quantity: "",
    unit: "",
  });
  const { addStatus, addError } = useSelector((state) => state.fridge);
  const prevStatus = useRef(addStatus);
  const dispatch = useDispatch();

  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = `${name.replace(/([A-Z])/g, " $1")} is required.`;
    } else {
      switch (name) {
        case "ingredientName":
          if (!/^[A-Za-z\s]+$/.test(value))
            error = "Ingredient Name must contain only letters.";
          break;
        case "quantity":
          if (!/^\d+$/.test(value)) error = "Quantity must be a valid number.";
          break;
        default:
          break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key].trim()) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("form data: ", formData);
      const payload = {
        name: formData.ingredientName,
        quantity: formData.quantity,
        unit: formData.unit,
      };
      dispatch(addIngredient(payload));
    }
  };

  const handleClose = () => {
    setFormData({ ingredientName: "", quantity: "", unit: "" });
    dispatch(resetAddError());
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (prevStatus.current === "loading" && addStatus === "succeeded") {
      setFormData({ ingredientName: "", quantity: "", unit: "" });
      setErrors({});
      onClose();
      dispatch(fetchIngredients());
      dispatch(resetAddError());
    }
    prevStatus.current = addStatus;
  }, [addStatus, dispatch, onClose]);

  return (
    <Modal show={isOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleSubmit}
          noValidate
          className={classes.addIngredientModalForm}
        >
          <div className={classes.formInput}>
            <label
              htmlFor="ingredientName"
              className={classes.addIngredientLabel}
            >
              Ingredient Name
            </label>
            <input
              type="text"
              name="ingredientName"
              value={formData.ingredientName}
              onChange={handleChange}
              required
            />
            {errors.ingredientName && (
              <div className={classes.addFormError}>
                {errors.ingredientName}
              </div>
            )}
          </div>

          <div className={classes.formInput}>
            <label htmlFor="quantity" className={classes.addIngredientLabel}>
              Quantity
            </label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            {errors.quantity && (
              <div className={classes.addFormError}>{errors.quantity}</div>
            )}
          </div>

          <div className={classes.formInput}>
            <label htmlFor="unit" className={classes.addIngredientLabel}>
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a unit
              </option>
              <option value="kg">Kilograms (kg)</option>
              <option value="grams">Grams (g)</option>
              <option value="cubes">Cubes</option>
              <option value="liters">Liters (L)</option>
              <option value="unit">Unit</option>
            </select>
            {errors.unit && (
              <div className={classes.addFormError}>{errors.unit}</div>
            )}
          </div>

          <Modal.Footer>
            <div onClick={handleClose} className={classes.cancelButton}>
              Cancel
            </div>
            <div
              onClick={handleSubmit}
              className={`${classes.addIngredientButton} ${
                !formData.ingredientName.trim() ||
                !formData.quantity.trim() ||
                !formData.unit.trim()
                  ? classes.addButtonDisabled
                  : ""
              }
              } `}
              disabled={
                !formData.ingredientName.trim() ||
                !formData.quantity.trim() ||
                !formData.unit.trim()
              }
            >
              Add
            </div>
            <div>
              {addStatus === "succeeded" && (
                <div className={classes.addFormSuccess}>
                  Ingredient added successfully!
                </div>
              )}
              {addStatus === "failed" && addError && (
                <div className={classes.addFormError}>Error: {addError}</div>
              )}
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddIngredientModal;
