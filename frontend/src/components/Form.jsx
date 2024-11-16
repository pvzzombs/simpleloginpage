import React from "react";
import PropTypes from "prop-types";

function Form(props) {

    props.styles.form = {
        ...props.styles.form,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "auto"
    }

    const inputStyle = {
        display: "block"
    }

    return (
        <div style={props.styles.form}>
            {props.title === null ? null : <p>{props.title}</p>}
            {props.fields.map((field) => {
                return (
                    <div style={inputStyle}>
                        <p style={props.styles.inputTextStyle}>{field.label}</p>
                        <input id={field.id} type={field.type} style={props.styles.inputBoxStyle}></input>
                    </div>
                );
            })}
        </div>
    );
    
}

Form.propTypes = {
    title: PropTypes.string,
    fields: PropTypes.array,
    styles: PropTypes.object
}

Form.defaultProps = {
    title: null,
    fields: [
        {
            id: "usr",
            label: "Username",
            placeholder: null,
            type: "text"
        },
        {
            id: "pw",
            label: "Password",
            placeholder: null,
            type: "text"
        }
    ],
    styles: {
        form: {
            boxShadow: "0px 0px 5px 2px lightgray",
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "black",
            width: "220px",
            fontFamily: "Inter, Consolas"
        },
        inputBoxStyle: {
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: "1px",
            borderRadius: "5px"
        },
        inputTextStyle: {
            textAlign: "left",
            marginBottom: "2px"
        }
    }
}

export default Form;