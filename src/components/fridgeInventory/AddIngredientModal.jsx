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

const UNIT_OPTIONS = [{ value: "none", label: "none" }];

const INITIAL_FORM_STATE = {
  ingredientName: "",
  quantity: "",
  unit: "",
  expiryDate: null,
};

const AddIngredientModal = ({ isOpen, onClose }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [unitOptions, setUnitOptions] = useState(UNIT_OPTIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addStatus, addError, ingredientNames, fetchIngredientNamesStatus } =
    useSelector((state) => state.fridge);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  // Fetch ingredients when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchIngredientsToSelect());
    }
  }, [isOpen, dispatch]);

  // Reset form when closing or after successful add
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setUnitOptions(UNIT_OPTIONS);
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
        setIsSubmitting(false);
        handleClose();
      }, 300);

      return () => clearTimeout(timer);
    }

    if (addStatus === "failed") {
      setIsSubmitting(false);
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
    } else if (name === "ingredientName" && !/^[A-Za-z\s()/]+$/.test(value)) {
      error =
        "Ingredient Name must contain only letters, spaces, parentheses, and slashes.";
    } else if (name === "quantity" && !/^\d+$/.test(value)) {
      error = "Quantity must be a valid number.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // Handle form field changes
  const handleChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // If the name is ingredientName, update the unit options and set default unit
      if (name === "ingredientName" && value) {
        const selectedIngredient = ingredientNames.find(
          (ingredient) => ingredient.name === value
        );

        if (
          selectedIngredient &&
          selectedIngredient.commonUnits &&
          selectedIngredient.commonUnits.length > 0
        ) {
          // Format the unit options
          const ingredientUnitOptions = selectedIngredient.commonUnits.map(
            (unit) => ({
              value: unit,
              label: unit,
            })
          );

          // Set the unit options
          setUnitOptions(ingredientUnitOptions);

          // Set the default unit from the ingredient if available
          if (selectedIngredient.defaultUnit) {
            setFormData((prevData) => ({
              ...prevData,
              unit: selectedIngredient.defaultUnit,
            }));
          } else if (ingredientUnitOptions.length > 0) {
            // Fallback to the first available unit if no default is specified
            setFormData((prevData) => ({
              ...prevData,
              unit: ingredientUnitOptions[0].value,
            }));
          }
        } else {
          // If no common units found, reset to default options
          setUnitOptions(UNIT_OPTIONS);
          setFormData((prevData) => ({
            ...prevData,
            unit: "none",
          }));
        }
      }

      validateField(name, value);
    },
    [ingredientNames]
  );

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

      setIsSubmitting(true);

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

  const ingredientOptions =
    ingredientNames && ingredientNames.length > 0
      ? ingredientNames.map((ingredient) => ({
          value: ingredient.name,
          label: ingredient.name,
        }))
      : [];

  return (
    <Modal show={isOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fetchIngredientNamesStatus === "loading" ? (
          <div className={classes.loadingSpinner}>
            <span>Loading ingredients...</span>
          </div>
        ) : (
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
                  handleChange("ingredientName", option?.value || "")
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
                onChange={(option) => handleChange("unit", option?.value || "")}
                placeholder="Select a unit"
                isSearchable={true}
                styles={{
                  container: (provided) => ({ ...provided, width: "100%" }),
                }}
                isDisabled={!formData.ingredientName}
              />
              {errors.unit && (
                <div className={classes.addFormError}>{errors.unit}</div>
              )}
            </div>

            <div className={classes.formInput}>
              <label
                htmlFor="expiryDate"
                className={classes.addIngredientLabel}
              >
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
              <button
                type="submit"
                onClick={handleSubmit}
                className={`${classes.addIngredientButton} ${
                  !isFormValid || isSubmitting ? classes.addButtonDisabled : ""
                }`}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <div className={classes.buttonLoader}>
                    <span className={classes.spinnerSmall}></span>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add"
                )}
              </button>
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddIngredientModal;

// export default React.memo(AddIngredientModal);
