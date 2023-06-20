export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const validateName = (name) => {
  return name.match(/^[a-zA-Z]+$/);
};

export const validateNumber = (phoneNumber) => {
  if (phoneNumber) {
    if (phoneNumber.length == 10){
      return true;
    } else if (isNaN(phoneNumber))  {
      return false;
    }   
  }
  return false;
};