import React from 'react';
import { Input } from "@/components/ui/input";

export const TextInput = ({ value, onChange, placeholder }) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full"
  />
);
