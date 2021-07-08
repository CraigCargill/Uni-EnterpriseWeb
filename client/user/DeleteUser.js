//Relevant imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import auth from "./../auth/auth-helper";
import { remove } from "./api-user.js";
import { Redirect } from "react-router-dom";

//The main component section of DeleteUser
export default function DeleteUser(props) {
  //The relevant variables are setup
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const jwt = auth.isAuthenticated();

  //When called setOpen becomes true
  const clickButton = () => {
    setOpen(true);
  };

  //when called, the current user will be deleted and logged out
  //of the website
  const deleteAccount = () => {
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log("deleted"));
        setRedirect(true);
      }
    });
  };

  //when called, setOpen will become false
  const handleRequestClose = () => {
    setOpen(false);
  };

  //Redirect if necessary
  if (redirect) {
    return <Redirect to="/" />;
  }

  //Main component section of confirm dialog for deleting user
  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
