import * as yup from 'yup';

/* Shared field rules -------------------------------------------------- */

const email = yup
  .string()
  .trim()
  .required('Email address is required.')
  .email('Enter a valid email address.');

const requiredPassword = yup.string().required('Password is required.');

const strongPassword = yup
  .string()
  .required('Password is required.')
  .min(8, 'Password must be at least 8 characters.');

const phone = yup
  .string()
  .trim()
  .required('Phone number is required.')
  .min(7, 'Enter a valid phone number.');

const name = (label: string) => yup.string().trim().required(`${label} is required.`);

/* Auth ---------------------------------------------------------------- */

export const loginSchema = yup.object({
  email,
  password: requiredPassword,
});

export const staffLoginSchema = loginSchema;

export const signupSchema = yup.object({
  firstName: name('First name'),
  lastName: name('Last name'),
  email,
  phone,
  password: strongPassword,
  confirm: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
  ndpaConsent: yup
    .boolean()
    .oneOf([true], 'You must accept the Privacy Policy to continue.'),
});

export const forgotPasswordSchema = yup.object({ email });

export const resetPasswordSchema = yup.object({
  password: strongPassword,
  confirm: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
});

export const adminRegisterSchema = yup.object({
  firstName: name('First name'),
  lastName: name('Last name'),
  email,
  phone,
  password: strongPassword,
  confirm: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
});

/* Admin onboarding ---------------------------------------------------- */

export const onboardAgentSchema = yup.object({
  name: name('Full name'),
  email,
  phone,
});

export const createAdminSchema = yup.object({
  name: name('Full name'),
  email,
  phone,
  password: strongPassword,
});

/* Travel requests ----------------------------------------------------- */

export const newRequestSchema = yup.object({
  origin: yup.string().trim().required('Origin city is required.'),
  destination: yup.string().trim().required('Destination is required.'),
  departureDate: yup.string().required('Departure date is required.'),
  budgetTier: yup.string().required('Select a cabin class.'),
});

export const quoteOptionSchema = yup.object({
  label: yup.string().trim().required('A label is required.'),
  airline: yup.string().trim().required('Airline is required.'),
  price: yup
    .number()
    .typeError('Enter a price.')
    .required('Enter a price.')
    .positive('Price must be greater than zero.'),
  departureTime: yup.string().trim().required('Departure time is required.'),
});

/* Wallet -------------------------------------------------------------- */

export const topupSchema = yup.object({
  amount: yup
    .number()
    .typeError('Enter an amount.')
    .required('Enter an amount.')
    .positive('Amount must be greater than zero.')
    .min(100, 'Minimum top-up is ₦100.'),
});
