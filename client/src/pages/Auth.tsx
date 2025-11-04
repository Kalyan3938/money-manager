import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

type LoginFormValues = {
  email: string;
  password: string;
};

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "krish.jayavarapu@gmail.com",
      password: "Krish555"
    }
  });

  // Register form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>({ defaultValues: {
    name: "Hemakrishna",
    email: "krish@gmail.com",
    password: "Krish555"
  }});

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const handleLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    const { email, password } = data;
    const success = await login(email, password);
    if (success === true) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else if (success){
      toast.error(success);
    }
    else {
      toast.error("Something went wrong. please try again later");
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    const { name, email, password } = data;
    const success = await register(name, email, password);
    if (success === true) {
      toast.success('Registration successful!');
      navigate('/auth/register/success');
    } else if (success) {
      toast.error(success);
    } else {
      toast.error('Something went wrong. Please try again');
    }
    setIsSubmitting(false)
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">MoneyAI</h1>
          </div>

          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* ---------- LOGIN FORM ---------- */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="Enter your email address"
                    {...registerLogin('email', { required: 'Email is required' })}
                  />
                  {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    placeholder="Enter your password"
                    {...registerLogin('password', {
                      required: 'Password is required',
                      minLength: { value: 5, message: 'Minimum 5 characters required' },
                    })}
                  />
                  {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password.message}</p>}
                </div>

                <Button disabled={isSubmitting} type="submit" 
                  className={`w-full text-white font-semibold py-2 rounded-md transition-colors ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* ---------- REGISTER FORM ---------- */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegisterSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...registerRegister('name', { required: 'Full name is required', minLength: {value: 3, message:"name must be atlease 3 characters long"} })}
                  />
                  {registerErrors.name && <p className="text-sm text-red-500">{registerErrors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="Enter your email address"
                    {...registerRegister('email', { required: 'Email is required' })}
                  />
                  {registerErrors.email && <p className="text-sm text-red-500">{registerErrors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    placeholder="Enter your password"
                    {...registerRegister('password', {
                      required: 'Password is required',
                      minLength: { value: 5, message: 'Minimum 5 characters required' },
                    })}
                  />
                  {registerErrors.password && <p className="text-sm text-red-500">{registerErrors.password.message}</p>}
                </div>

                <Button type="submit" 
                  className={`w-full text-white font-semibold py-2 rounded-md transition-colors ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Registering" : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
