enum ResponseMessage {
  SUCCESS = "Success.",
  VALIDATION_FAIL = "Validation failed.",
  
  DUPLICATE_ID = "Duplicate Id.",
  DUPLICATE_EMAIL = "Duplicate Email.",

  SIGN_IN_FAIL = "Login information mismatch.",
  CERTIFICATION_FAIL = "Certification failed.",

  MAIL_FAIL = "Mail Send failed",
  DATABASE_ERROR = "Database error."
};

export default ResponseMessage;