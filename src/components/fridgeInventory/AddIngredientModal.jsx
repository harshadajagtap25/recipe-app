import React, { useEffect, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/contexts/AuthContext";
import classes from "../../styles/fridge.module.scss";
import {
  addIngredient,
  fetchIngredientsForDisplay,
  fetchIngredientsToSelect,
  resetAddError,
} from "@/redux/fridgeSlice";

const UNIT_OPTIONS = [
  // { value: "ml", label: "ml" },
  // { value: "l", label: "l" },
  // { value: "g", label: "g" },
  // { value: "kg", label: "kg" },
  // { value: "unit", label: "unit" },
  // { value: "count", label: "count" },
  { value: "none", label: "none" },
];

const INITIAL_FORM_STATE = {
  ingredientName: "",
  quantity: "",
  unit: [],
  expiryDate: null,
};

const AddIngredientModal = ({ isOpen, onClose }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [unitOptions, setUnitOptions] = useState(UNIT_OPTIONS);

  const { addStatus, addError, ingredientNames } = useSelector(
    (state) => state.fridge
  );
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchIngredientsToSelect());
    }
  }, [isOpen, dispatch]);

  // Reset form when closing or after successful add
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    dispatch(resetAddError());
  }, [dispatch]);

  // Handle close with reset
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Handle successful submission with small delay to let backend process
  useEffect(() => {
    if (addStatus === "succeeded") {
      const timer = setTimeout(() => {
        dispatch(fetchIngredientsForDisplay(currentUser.id));
        handleClose();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [addStatus, dispatch, currentUser.id, handleClose]);

  // Validate a single field
  const validateField = (name, value) => {
    let error = "";

    if (name === "expiryDate") {
      if (value === null) return "";

      // Check if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value < today) {
        error = "Expiry date cannot be in the past.";
      }
      return error;
    }

    if (!value?.toString().trim()) {
      error = `${
        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")
      } is required.`;
    } else if (name === "ingredientName" && !/^[A-Za-z\s()]+$/.test(value)) {
      error = "Ingredient Name must contain only letters.";
    } else if (name === "quantity" && !/^\d+$/.test(value)) {
      error = "Quantity must be a valid number.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // Handle form field changes
  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // If the name is ingredientName, update the unit options and set default unit
    if (name === "ingredientName" && value) {
      // Find the selected ingredient from your ingredients data
      const selectedIngredient = ingredientNames.find(
        (ingredient) => ingredient.name === value
      );

      if (selectedIngredient) {
        // Create unit options from the ingredient's commonUnits
        const ingredientUnitOptions = selectedIngredient.commonUnits.map(
          (unit) => ({
            value: unit,
            label: unit,
          })
        );

        // Set the unit options
        setUnitOptions(ingredientUnitOptions);

        // Set the default unit from the ingredient
        setFormData((prevData) => ({
          ...prevData,
          unit: selectedIngredient.defaultUnit,
        }));
      }
    }
    validateField(name, value);
  }, []);

  // Form submission handler
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();

      // Validate all fields
      const newErrors = {};
      let hasErrors = false;

      // Validate required fields
      const requiredFields = ["ingredientName", "quantity", "unit"];
      requiredFields.forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      });

      // Validate expiry date separately (optional field)
      const expiryDateError = validateField("expiryDate", formData.expiryDate);
      if (expiryDateError) {
        newErrors.expiryDate = expiryDateError;
        hasErrors = true;
      }

      if (hasErrors) {
        setErrors(newErrors);
        return;
      }

      const payload = {
        ingredientToAdd: {
          items: [
            {
              name: formData.ingredientName,
              quantity: formData.quantity,
              unit: formData.unit,
              expiryDate: formData.expiryDate
                ? formData.expiryDate.toISOString()
                : null,
            },
          ],
        },
        userId: currentUser.id,
      };

      dispatch(addIngredient(payload));
    },
    [formData, currentUser.id, dispatch]
  );

  // Check if form is valid for submission
  const isFormValid =
    formData.ingredientName.trim() &&
    formData.quantity.trim() &&
    formData.unit &&
    (!formData.expiryDate || !errors.expiryDate) &&
    Object.values(errors).every((error) => !error);

  const ingredientOptions = ingredientNames.map((ingredient) => ({
    value: ingredient.name,
    label: ingredient.name,
  }));

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
            <Select
              options={ingredientOptions}
              value={
                formData.ingredientName
                  ? {
                      value: formData.ingredientName,
                      label: formData.ingredientName,
                    }
                  : null
              }
              onChange={(option) =>
                handleChange("ingredientName", option.value)
              }
              placeholder="Select an ingredient"
              isSearchable={true}
              styles={{
                container: (provided) => ({ ...provided, width: "100%" }),
              }}
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
              onChange={(e) => handleChange("quantity", e.target.value)}
              required
              className={classes.quantityInput}
              placeholder="Enter a quantity"
            />
            {errors.quantity && (
              <div className={classes.addFormError}>{errors.quantity}</div>
            )}
          </div>

          <div className={classes.formInput}>
            <label htmlFor="unit" className={classes.addIngredientLabel}>
              Unit
            </label>
            <Select
              options={unitOptions}
              value={
                formData.unit
                  ? {
                      value: formData.unit,
                      label: formData.unit,
                    }
                  : null
              }
              onChange={(option) => handleChange("unit", option.value)}
              placeholder="Select a unit"
              isSearchable={true}
              styles={{
                container: (provided) => ({ ...provided, width: "100%" }),
              }}
            />
            {errors.unit && (
              <div className={classes.addFormError}>{errors.unit}</div>
            )}
          </div>

          <div className={classes.formInput}>
            <label htmlFor="expiryDate" className={classes.addIngredientLabel}>
              Expiry Date
            </label>
            <DatePicker
              selected={formData.expiryDate}
              onChange={(date) => handleChange("expiryDate", date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Select expiry date (optional)"
              className={classes.datePicker}
              isClearable
              showYearDropdown
              scrollableMonthYearDropdown
              wrapperClassName={classes.datePickerWrapper}
            />
            {errors.expiryDate && (
              <div className={classes.addFormError}>{errors.expiryDate}</div>
            )}
          </div>

          <Modal.Footer>
            <div onClick={handleClose} className={classes.cancelButton}>
              Cancel
            </div>
            <div
              onClick={handleSubmit}
              className={`${classes.addIngredientButton} ${
                !isFormValid ? classes.addButtonDisabled : ""
              }`}
              aria-disabled={!isFormValid}
            >
              Add
            </div>
            {addStatus === "succeeded" && (
              <div className={classes.addFormSuccess}>
                Ingredient added successfully!
              </div>
            )}
            {addStatus === "failed" && addError && (
              <div className={classes.addFormError}>Error: {addError}</div>
            )}
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(AddIngredientModal);
