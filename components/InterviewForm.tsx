"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { generateInterviewSchema, GenerateInterviewInput } from "@/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import React from "react";

const GenerateInterviewForm = () => {
  const form = useForm<GenerateInterviewInput>({
    resolver: zodResolver(generateInterviewSchema),
    defaultValues: {
      role: "",
      type: "",
      level: "",
      amount: "",
      techstack: "",
      company: "",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  
  const onSubmit = async (values: GenerateInterviewInput) => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userid: user?.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Interview generated and saved!");
        router.push("/");
      } else {
        toast.error("Something went wrong: " + result.error?.message || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-xl mx-auto"
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
          Generate Interview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the details to create your personalized mock interview
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="role"
              label="What role would you like to prepare for?"
              placeholder="e.g., Frontend Engineer"
            />
            <FormField
              control={form.control}
              name="type"
              label="Are you aiming for a behavioral or technical interview?"
              placeholder="e.g., Technical"
            />
            <FormField
              control={form.control}
              name="level"
              label="The job experience level you're targeting?"
              placeholder="e.g., Mid-Senior"
            />
            <FormField
              control={form.control}
              name="amount"
              label="How many questions would you like?"
              placeholder="e.g., 5"
            />
            <FormField
              control={form.control}
              name="techstack"
              label="A list of technologies to focus on"
              placeholder="e.g., React, Node.js"
            />
            <FormField
              control={form.control}
              name="company"
              label="What company are you preparing for?"
              placeholder="e.g., Google"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Interview"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default GenerateInterviewForm;