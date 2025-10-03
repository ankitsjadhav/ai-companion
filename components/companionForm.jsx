"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { SelectSeparator } from "./ui/select";
import { ImageUpload } from "./image-upload";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is Required.",
  }),
  description: z.string().min(1, {
    message: "Description is Required.",
  }),
  instruction: z.string().min(200, {
    message: "Intruction is Required atleast 200 characters.",
  }),
  seed: z.string().min(200, {
    message: "Seed is Required atleast 200 characters.",
  }),
  src: z.string().min(1, {
    message: "Image is Required.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is Required.",
  }),
});

export const CompanionForm = ({ initialData, categories }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instruction: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values) => {
    console.log(values);
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General informationa about your companion
              </p>
            </div>
            <SelectSeparator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-4 justify-center">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
