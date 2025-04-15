"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { generateInterviewSchema, GenerateInterviewInput } from "@/constants";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";  // Use the `useRouter` hook from `next/navigation`

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

  const router = useRouter();  // Get the router instance
  const onSubmit = async (values: GenerateInterviewInput) => {
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
        router.push("/");  // Navigate to the homepage only if client-side
      } else {
        toast.error("Something went wrong: " + result.error?.message || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate interview");
    }
  };

  return (
    <div className="card p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Generate Interview</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 mt-4 form"
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

          <Button className="w-full btn" type="submit">
            Generate Interview
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GenerateInterviewForm;
