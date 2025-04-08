"use client";

import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff } from "lucide-react";

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
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />

          {showStrength && (
            <>
              <div className="h-2 mt-2 rounded-full bg-gray-800 w-auto">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"][passwordStrength]
                  }`}
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                />
              </div>

              {passwordFeedback && (
                <p className="text-xs mt-1 text-muted-foreground">
                  {passwordFeedback}
                </p>
              )}
            </>
          )}
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
