import * as yup from 'yup';

export const studentSchema = yup.object({
    name: yup.string().min(4, "Name must contain at least 4 characters").required("Name is required"),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    student_classes: yup.array().of(yup.string("Each class must be a string value")).min(1, "At least one class must be selected").required("Classes are required"),
    age: yup.string().required("Age is required"),
    gender: yup.string().required("Gender is required"),
    guardian: yup.string().min(4, "Guardian's name must contain at least 4 characters").required("Guardian is required"),
    guardian_phone: yup.string().min(10, "Phone number must contain at least 10 digits").required("Phone is required"),
    password: yup.string().required("Password is required"),
});
