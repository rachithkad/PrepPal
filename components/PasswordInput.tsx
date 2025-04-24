"use client";

import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  showStrength?: boolean;
}

const PasswordField = <T extends FieldValues>({
  control,
  name,
  label = "Password",
  placeholder = "Enter your password",
  showStrength = true,
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-600 dark:text-gray-400">
            {label}
          </FormLabel>
          <FormControl>
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="w-full"
                {...field}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val);

                  if (showStrength) {
                    const result = zxcvbn(val);
                    setPasswordStrength(result.score);
                    setPasswordFeedback(result.feedback.warning || "");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </motion.div>
          </FormControl>
          <FormMessage />

          {showStrength && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1 mt-2"
            >
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    [
                      "bg-red-500",
                      "bg-orange-400",
                      "bg-amber-400",
                      "bg-emerald-400",
                      "bg-emerald-600",
                    ][passwordStrength]
                  }`}
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                />
              </div>

              {passwordFeedback && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {passwordFeedback}
                </p>
              )}
            </motion.div>
          )}
        </FormItem>
      )}
    />
  );
};

export default PasswordField;