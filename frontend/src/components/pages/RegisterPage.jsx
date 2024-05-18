import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthData } from "../../AuthWrapper";
import { NavLink } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).includes("."),
});

const RegisterPage = () => {
  const { signup } = AuthData();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    signup(data)
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => setError("root", { message: err }));
  };

  return (
    <div className="max-w-96">
      <div className="bg-blue-500 text-2xl">Register Form</div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          className="border-2"
          type="text"
          id="username"
          autoComplete="false"
          {...register("username")}
        />
        {errors.username && (
          <div className="text-red-500 ">{errors.username.message}</div>
        )}
        <label htmlFor="email">Email</label>
        <input
          className="border-2"
          type="email"
          id="email"
          autoComplete="false"
          {...register("email")}
        />
        {errors.email && (
          <div className="text-red-500 ">{errors.email.message}</div>
        )}
        <label htmlFor="password">Password</label>
        <input
          className="border-2"
          type="password"
          id="password"
          {...register("password")}
        />
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        <div className="text-xs">
          Already have an Account? &nbsp;
          <NavLink to="/login" className={"text-base"}>
            Login
          </NavLink>
        </div>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
