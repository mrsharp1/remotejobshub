import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { authService } from '@/services/auth/auth.service'
import { zodResolver } from '@/utils/resolver'
import { useAuthStore } from '@/stores/authStore'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    phone: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  })

  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (!pass) return { score, label: 'None', color: 'bg-muted' }
    if (pass.length >= 8) score++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive' }
    if (score <= 3) return { score, label: 'Medium', color: 'bg-yellow-500' }
    return { score, label: 'Strong', color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const signUpResult = await authService.signUp(data.email, data.password, {
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            country: data.country,
          },
        },
      })

      const user = signUpResult?.user
      const session = signUpResult?.session

      if (user) {
        // Immediately update corresponding row in public.profiles table
        try {
          const updatedProfile = await authService.updateProfile(user.id, {
            full_name: data.fullName,
            phone: data.phone || null,
            country: data.country,
          })

          // Sync auth store immediately if session was created automatically
          if (session && updatedProfile) {
            useAuthStore.getState().setAuth(user, updatedProfile, session)
          }
        } catch (updateErr) {
          console.error('Failed to complete user profile details:', updateErr)
        }
      }

      setIsSuccess(true)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 animate-bounce text-emerald-500" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Account Created Successfully!
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We have sent a verification link to your email address. Please
            verify your email to log in and start using Remote Jobs Hub.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex w-full justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Go to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg"
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-destructive/10 rounded-lg p-3 text-sm text-destructive"
          >
            {errorMsg}
          </motion.div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="h-5 w-5" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  className={`block w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.fullName ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="John Doe"
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  className={`block w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.email ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="name@company.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground"
                >
                  Phone{' '}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    className="block w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="+234..."
                    {...register('phone')}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-foreground"
                >
                  Country
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Globe className="h-5 w-5" />
                  </span>
                  <input
                    id="country"
                    type="text"
                    className={`block w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.country ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="Nigeria"
                    {...register('country')}
                  />
                </div>
                {errors.country && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.password ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="••••••••"
                  {...register('password', {
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordValue && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Password strength:
                    </span>
                    <span
                      className={
                        strength.label === 'Strong'
                          ? 'text-emerald-500'
                          : strength.label === 'Medium'
                            ? 'text-yellow-500'
                            : 'text-destructive'
                      }
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`block w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.confirmPassword
                      ? 'border-destructive'
                      : 'border-input'
                  }`}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  {...register('agreeToTerms')}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-muted-foreground">
                  I agree to the{' '}
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
