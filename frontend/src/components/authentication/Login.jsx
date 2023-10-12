import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import Loader from "../Loader";
const Login = () => {
  const [isLoading, setisLoading] = useState(false)
    const [show, setshow] = useState(false);
    const handleClick = () => setshow(!show);
     const onSubmit = (values) => {
       setisLoading(true);
       const data = {
         email: values.email,
         password: values.password,
       };
       axios
         .post("http://localhost:5000/users/login", data)
         .then((res) => {
           console.log(res);
         })
         .catch((error) => {
           console.log(error);
         })
         .finally(() => {
           setisLoading(false);
         });
     };

     const emailValidate =
       /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

     const { handleSubmit, handleChange, errors, touched, handleBlur, values } =
       useFormik({
         initialValues: {
           email: "",
           password: "",
         },
         validationSchema: yup.object().shape({
           email: yup
             .string()
             .matches(emailValidate, "Must be a valid email")
             .required("Email field is required"),
           password: yup
             .string()
             .required("Password field cannot be empty")
             .min(6, "Password cannot be less than 6 characters"),
         }),
         onSubmit,
       });
  return (
    <>
    {isLoading ? <Loader/> : null}
      <VStack spacing={"5px"}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            placeholder="Enter Your Email"
          />
          {touched.email && errors.email && (
            <small className="text-red-600 font-bold">{errors.email}</small>
          )}
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size={"md"}>
            <Input
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter Your Password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="orange"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </VStack>
    </>
  );
};

export default Login;
