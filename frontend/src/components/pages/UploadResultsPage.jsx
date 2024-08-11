import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthData } from "../../AuthWrapper";
import { NavLink } from "react-router-dom";
import { withAccessToken } from "../../axios";
import { useEffect } from "react";

const UploadResultsPage = () => {
  const { setNewToken, getNewTokens, setNewTokenInterval } = AuthData();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    // defaultValues: {
    //   username: "",
    //   email: "",
    //   password: "",
    // },
    // resolver: zodResolver(schema),
  });

  useEffect(() => {
    // setNewTokenInterval();
  }, []);

  const onSubmit = async (data) => {
    console.log("data:", data);
    // console.log("from converted: ", data);
    // data.file = data.file[0];
    console.log("from converted: ", data);
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("title", data.title);
    formData.append("subjects", data.subjects);

    const submitResults = () => {
      withAccessToken
        .post("/api/results", formData)
        .then((res) => {
          console.log("res: ", res);
          console.log("resmsg: ", res.data.msg ? res.data.msg : "");

          if (res.data.msg == "Token Expired") {
            getNewTokens();
            // setNewTokenInterval();
            // alert("Unable to Submit Results, Try Again");
            console.log("Token Expired from upload results page");
            submitResults();
          } else {
            alert("Results Submitted Successfully");
          }
        })
        .catch((err) => console.log("root", { message: err }));
    };
    submitResults();
  };
  return (
    <div className="max-w-96">
      <div className="bg-blue-500 text-2xl">Upload Results File</div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="title">Title</label>
        <input
          className="border-2"
          type="text"
          id="title"
          autoComplete="false"
          {...register("title")}
        />
        {errors.title && (
          <div className="text-red-500 ">{errors.title.message}</div>
        )}
        <label htmlFor="subjects">Subjects</label>
        <input
          className="border-2"
          type="text"
          id="subjects"
          autoComplete="false"
          {...register("subjects")}
        />
        {errors.subjects && (
          <div className="text-red-500 ">{errors.subjects.message}</div>
        )}
        <label htmlFor="file">Upload Results File(.xml)</label>
        <input
          className="border-2"
          type="file"
          accept=".xlsx, .xls"
          id="file"
          {...register("file")}
        />
        {errors.file && (
          <div className="text-red-500">{errors.file.message}</div>
        )}
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

export default UploadResultsPage;
