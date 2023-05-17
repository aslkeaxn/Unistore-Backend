const UserType = {
    Student: "Student",
    Partner: "Partner",
};

const VerificationType = {
    Email: "Email",
    PasswordReset: "PasswordReset",
};

const UpdatePasswordType = {
    Id: "ID",
    Email: "Email",
};

const AdvertisementType = {
    Product: "Product",
    Service: "Service",
    Request: "Request",
};

const StoreType = {
    Default: "Default",
    User: "User",
    Partner: "Partner",
};

const StoreId = {
    Product: "642731a1382926e240abade3",
    Service: "642731c7382926e240abade6",
    Request: "642731ce382926e240abade7",
};

const MessageStatus = {
    Sent: "Sent",
    Read: "Read",
};

const SubscriptionType = {
    Free: "Free",
    Premium: "Premium",
};

const Errors = {
    JWTError: "Invalid token",
    ServerError: "Server error",
    FirstNameError:
        "First name should be alphabetic and at least 2 characters long",
    LastNameError:
        "Last name should be alphabetic and at least 2 characters long",
    UsernameFormError:
        "Username must be alphanumeric and at least 4 characters long",
    UsernameExistsError: "Username already exists",
    EmailFormError: "Invalid email",
    EmailDomainError: "You must use your university email",
    PasswordError: "Password should be at least 6 characters long",
    PhoneNumberFormError:
        "Phone number must be numeric and exactly 8 digits long",
    PhoneNumberExistsError: "Phone number already used",
    EmailVerifiedError: "User already registered",
    VerificationCodeError:
        "A verification code has already been sent to the email",
    InvalidLogInCredentialsError: "Incorrect credential combination",
    UserUnverifiedError: "Account verification is incomplete",
    MailerError: "Could not send email, please try again later",
    UserTypeError: "User type must be specified",
    UserNotFoundError: "Could not retrieve user details",
    IncorrectPasswordError: "Incorrect password entered",
    UserVerfiedError: "User is already verifed",
    NoVerificationCodeError: "Code does not exist",
    InvalidVerificationCodeError: "Incorrect code was entered",
    ExpiredVerificationCodeError:
        "Verification code expired, please sign up again",
    AdvertisementTypeError: "Advertisement type must be valid and specified",
    CategoryIdError: "Category must be specified",
    AdvertisementTitleError:
        "Title must be specified and at least 3 characters long",
    AdvertisementDescriptionError:
        "Description must be specified and st least 20 characters long",
    AdvertisementPriceError: "Price should be specified and must be a number",
    AdvertisementStockError: "Stock should be specified and must be a number",
    AdvertisementNotFoundError: "Could not retrieve advertisement details",
    AdvertisementUnauthorizedError: "Unauthorized to modify advertisement",
    UserStoreAlreadyExistsError: "Only one store can be created by a user",
    StoreNameAlreadyInUseError: "The store name has already been taken",
    StoreNameInvalidError: "Store name must be at least 4 characters long",
    StoreDescriptionInvalidError:
        "Store description must be at least 20 characters long",
    StoreNotFoundError: "Store does not exist",
    UnauthorizedActionError: "Unauthorized action attempted",
    StoreImageMissingError: "Store must have an image provided",
    ConversationNotFound: "You can't send a message to that person",
    SenderIdMissing: "You must specify the sender's id",
    ReceiverIdMissing: "You must specify the receiver's id",
    ReceiverNotExistent: "There is no such user",
    MessageTextMissing: "A message must be at least 1 character long",
    ExpiredPasswordResetCodeError:
        "Password reset code expired, please start again",
    MessageNotFound: "Message does not exist",
    PartnerFreeTierError: "Subscribe to premium feature to post more than 3 Ads"
};

const Domains = { "qu.edu.qa": 1, "yopmail.com": 1 };

module.exports = {
    Errors,
    UserType,
    VerificationType,
    StoreType,
    StoreId,
    AdvertisementType,
    Domains,
    UpdatePasswordType,
    MessageStatus,
    SubscriptionType,
};
