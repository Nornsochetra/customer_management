'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {

    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        const res = await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (res?.status === 200) {
            router.push("/customer");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">

                {/* Header */}
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
                    Welcome back
                </h2>
                <p className="text-sm text-center text-gray-500 mb-8">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                    {/* Username */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && (
                            <p className="text-xs text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2.5 rounded-lg transition"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}