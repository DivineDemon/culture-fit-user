import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/form-schemas";
import { useLoginMutation } from "@/store/services/auth";
import type { RootState } from "@/types/global";

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const [login, { isLoading }] = useLoginMutation();
  const { user } = useSelector((state: RootState) => state.global);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const response = await login(data);

    if (response.data) {
      navigate("/chat");
      toast.success("Login successful");
    } else {
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user]);

  return (
    <div className="mx-auto flex h-full w-[90%] flex-col items-center justify-center gap-6 lg:w-2/3 xl:w-1/2">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <span className="w-full text-center font-bold text-[32px] leading-[32px] md:text-[48px] md:leading-[48px]">
          Welcome to Culture Fit
        </span>
        <span className="w-full text-center text-[#71717A] text-[14px] leading-[14px]">
          Enter your credentials to login.
        </span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="• • • • • • • •" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant="default" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In with Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
