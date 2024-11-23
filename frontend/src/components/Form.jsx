import React, { useState, memo } from "react";
import PropTypes from "prop-types";

// Password Field Component
const PasswordField = memo(
  ({
    field,
    inputStyle,
    inputLabelStyle,
    inputBoxStyle,
    checkboxStyle,
    inputRef,
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div style={inputStyle}>
        {field.label !== null && (
          <label htmlFor={field.id} style={inputLabelStyle}>
            {field.label}
          </label>
        )}
        <input
          id={field.id}
          type={showPassword ? "text" : "password"}
          placeholder={field.placeholder}
          style={inputBoxStyle}
          ref={inputRef}
        />
        {"showPasswordText" in field && field.showPasswordText !== null && (
          <div style={checkboxStyle}>
            <input type="checkbox" onClick={togglePasswordVisibility} />
            <label>{field.showPasswordText}</label>
          </div>
        )}
      </div>
    );
  }
);

// Main Form Component
function Form(props) {
  const formStyle = {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "black",
    fontFamily: "Inter, Arial",
    width: "250px",
    ...props.styles.form,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  };

  const inputContainerStyle = {
    width: "80%",
    gap: "10px 0px",
    ...props.styles.inputContainer,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const inputStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  };

  const inputLabelStyle = {
    textAlign: "left",
    fontSize: "1em",
    ...props.styles.inputLabel,
    margin: "0",
    marginBottom: "3px",
  };

  const inputBoxStyle = {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "1px",
    borderRadius: "5px",
    height: "20px",
    width: "100%",
    ...props.styles.inputBox,
  };

  const checkboxStyle = {
    fontSize: "14px",
    ...props.styles.checkbox,
    display: "flex",
    flexDirection: "row",
  };

  const submitButtonContainerStyle = {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    ...props.styles.submitButtonContainer,
  };

  const submitButtonStyle = {
    backgroundColor: "transparent",
    borderWidth: "1px",
    borderColor: "black",
    width: "100%",
    borderRadius: "5px",
    ...props.styles.submitButton,
  };

  const extraStyle = {
    textAlign: "center",
    width: "80%",
    ...props.styles.extra,
  };

  const inputRefs = {};

  const handleSubmit = () => {
    const inputValues = {};
    props.fields.forEach((field) => {
      const input = inputRefs[field.id];
      if (input) {
        inputValues[field.id] = input.value;
      }
    });

    props.submitButton.onClick(inputValues);
  };

  return (
    <div style={formStyle}>
      {props.title !== null && <p style={props.styles.title}>{props.title}</p>}
      <div style={inputContainerStyle}>
        {props.fields.map((field) =>
          field.type === "password" ? (
            <PasswordField
              key={field.id}
              field={field}
              inputStyle={inputStyle}
              inputLabelStyle={inputLabelStyle}
              inputBoxStyle={inputBoxStyle}
              checkboxStyle={checkboxStyle}
              inputRef={(el) => (inputRefs[field.id] = el)}
            />
          ) : (
            <div style={inputStyle} key={field.id}>
              {field.label !== null && (
                <label htmlFor={field.id} style={inputLabelStyle}>
                  {field.label}
                </label>
              )}
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                style={inputBoxStyle}
                ref={(el) => (inputRefs[field.id] = el)}
              />
            </div>
          )
        )}
      </div>
      <div style={submitButtonContainerStyle}>
        <input
          type="submit"
          value={props.submitButton.label}
          onClick={(event) => {event.preventDefault(); handleSubmit()}}
          style={submitButtonStyle}
        />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: props.extra }}
        style={extraStyle}
      />
    </div>
  );
}

Form.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.array,
  submitButton: PropTypes.object,
  styles: PropTypes.object,
};

Form.defaultProps = {
  title: null,
  fields: [
    {
      id: "user",
      label: "Username",
      placeholder: "Username",
      type: "text",
    },
    {
      id: "pw",
      label: "Password",
      placeholder: "Password",
      type: "password",
      showPasswordText: "Show Password",
    },
  ],
  submitButton: {
    label: "Submit",
    onClick: null,
  },
  extra: "<p>Not registered yet? Register <a href=''>here.</a></p>",
  styles: {
    form: {},
    title: {},
    inputContainer: {},
    inputBox: {},
    inputLabel: {},
    checkbox: {},
    submitButtonContainer: {},
    submitButton: {},
    extra: {},
  },
};

export default Form;
