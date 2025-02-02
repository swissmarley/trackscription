import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubscription } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionFormProps {
  onSuccess?: () => void;
}

export default function SubscriptionForm({ onSuccess }: SubscriptionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      serviceType: "",
      isFree: false,
      cost: "0",
      cycleType: "monthly",
      startDate: new Date(),
      serviceUrl: "",
      email: "",
      notes: "",
      files: []
    }
  });

  const mutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      toast({
        title: "Success",
        description: "Subscription added successfully",
      });
      onSuccess?.();
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'files' && value instanceof FileList) {
            Array.from(value).forEach(file => formData.append('files', file));
          } else {
            formData.append(key, String(value));
          }
        });
        mutation.mutate(formData);
      })} className="space-y-4 max-h-[80vh] overflow-y-auto p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Service</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        form.setValue("cost", "0");
                      }
                    }}
                  />
                </FormControl>
                <FormLabel>Free Subscription</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    disabled={form.watch("isFree")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cycleType"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>Billing Cycle</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value === "annually"}
                  onCheckedChange={(checked) => 
                    field.onChange(checked ? "annually" : "monthly")
                  }
                />
              </FormControl>
              <span>{field.value === "annually" ? "Annual" : "Monthly"}</span>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(field.value, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachments</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  multiple
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          Add Subscription
        </Button>
      </form>
    </Form>
  );
}