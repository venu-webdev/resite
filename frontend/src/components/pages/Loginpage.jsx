import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthData } from "../../AuthWrapper";
import { NavLink, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

const Loginpage = () => {
  const { user, login } = AuthData();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // console.log("Form Submitted:", data);
    login(data)
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => setError("root", { message: err }));
  };

  return (
    <div className="max-w-96">
      <div className="bg-red-500 text-2xl">Login Form</div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          className="border-2"
          type="email"
          id="username"
          autoComplete="nope"
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
          New here? &nbsp;
          <NavLink to="/register" className="text-base">
            Register
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

export default Loginpage;
