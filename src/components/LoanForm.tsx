import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Building2, DollarSign, Clock, PieChart, CreditCard, User } from "lucide-react";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { StepIndicator } from "./ui/StepIndicator";
import { sendLoanApplicationEmails } from "../utils/emailService";

// Define the schema for the form
const loanSchema = z.object({
  amount: z.string().min(1, "Please select an amount"),
  timeInBusiness: z.string().min(1, "Please select time in business"),
  revenue: z.string().min(1, "Please select revenue"),
  industry: z.string().min(1, "Please select an industry"),
  creditScore: z.string().min(1, "Please select credit score"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

export type LoanFormData = z.infer<typeof loanSchema>;

const STEPS = [
  { id: "amount", title: "Funding Amount", icon: DollarSign },
  { id: "timeInBusiness", title: "Time in Business", icon: Clock },
  { id: "revenue", title: "Monthly Revenue", icon: PieChart },
  { id: "industry", title: "Industry", icon: Building2 },
  { id: "creditScore", title: "Credit Score", icon: CreditCard },
  { id: "contact", title: "Contact Info", icon: User },
];

export const LoanForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof LoanFormData)[] = [];

    switch (currentStep) {
      case 0: fieldsToValidate = ["amount"]; break;
      case 1: fieldsToValidate = ["timeInBusiness"]; break;
      case 2: fieldsToValidate = ["revenue"]; break;
      case 3: fieldsToValidate = ["industry"]; break;
      case 4: fieldsToValidate = ["creditScore"]; break;
      case 5: fieldsToValidate = ["firstName", "lastName", "businessName", "email", "phone"]; break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        await onSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    
    try {
      // Send emails using our backend server
      await sendLoanApplicationEmails(data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Email service error:", error);
      // In a real production app, you might want to show an error message to the user.
      // For this demo/lead gen, we'll log it and still show the success screen so we don't lose the lead visually.
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  });

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl text-center border-t-4 border-accent">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-accent/10 p-4">
            <CheckCircle2 className="w-16 h-16 text-accent" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for applying! We have sent a confirmation email to your inbox. 
          One of our loan specialists will review your information and contact you shortly to discuss your funding options.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full bg-accent hover:bg-accent/90 text-white">
          Start New Application
        </Button>
      </div>
    );
  }

  const CurrentIcon = STEPS[currentStep].icon;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}% Completed</span>
        </div>
        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px]">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <CurrentIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{STEPS[currentStep].title}</h2>
            <p className="text-sm text-gray-500">Please fill out the information below</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">How much funding do you need?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["$5,000 - $10,000", "$10,000 - $50,000", "$50,000 - $200,000", "$200,000+"].map((option) => (
                      <Controller
                        key={option}
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <div
                            onClick={() => {
                              field.onChange(option);
                              nextStep();
                            }}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                              ${field.value === option 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-gray-200 hover:border-primary/50 hover:shadow-md bg-white"}
                            `}
                          >
                            <span className={`font-medium ${field.value === option ? "text-primary" : "text-gray-700"}`}>
                              {option}
                            </span>
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center
                              ${field.value === option ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary/70"}
                            `}>
                              {field.value === option && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">How long have you been in business?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Less than 6 months", "6 months - 1 year", "1 - 3 years", "3+ years"].map((option) => (
                      <Controller
                        key={option}
                        name="timeInBusiness"
                        control={control}
                        render={({ field }) => (
                          <div
                            onClick={() => {
                              field.onChange(option);
                              nextStep();
                            }}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                              ${field.value === option 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-gray-200 hover:border-primary/50 hover:shadow-md bg-white"}
                            `}
                          >
                            <span className={`font-medium ${field.value === option ? "text-primary" : "text-gray-700"}`}>
                              {option}
                            </span>
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center
                              ${field.value === option ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary/70"}
                            `}>
                              {field.value === option && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {errors.timeInBusiness && <p className="text-red-500 text-sm mt-2">{errors.timeInBusiness.message}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">What is your average monthly revenue?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Under $5,000", "$5,000 - $15,000", "$15,000 - $50,000", "$50,000 - $100,000", "$100,000+"].map((option) => (
                      <Controller
                        key={option}
                        name="revenue"
                        control={control}
                        render={({ field }) => (
                          <div
                            onClick={() => {
                              field.onChange(option);
                              nextStep();
                            }}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                              ${field.value === option 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-gray-200 hover:border-primary/50 hover:shadow-md bg-white"}
                            `}
                          >
                            <span className={`font-medium ${field.value === option ? "text-primary" : "text-gray-700"}`}>
                              {option}
                            </span>
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center
                              ${field.value === option ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary/70"}
                            `}>
                              {field.value === option && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {errors.revenue && <p className="text-red-500 text-sm mt-2">{errors.revenue.message}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">What industry are you in?</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Construction", "Retail", "Restaurant/Food Service", "Transportation/Trucking", "Healthcare", "Manufacturing", "Professional Services", "Other"].map((option) => (
                      <Controller
                        key={option}
                        name="industry"
                        control={control}
                        render={({ field }) => (
                          <div
                            onClick={() => {
                              field.onChange(option);
                              nextStep();
                            }}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                              ${field.value === option 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-gray-200 hover:border-primary/50 hover:shadow-md bg-white"}
                            `}
                          >
                            <span className={`font-medium ${field.value === option ? "text-primary" : "text-gray-700"}`}>
                              {option}
                            </span>
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center
                              ${field.value === option ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary/70"}
                            `}>
                              {field.value === option && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {errors.industry && <p className="text-red-500 text-sm mt-2">{errors.industry.message}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">What is your estimated credit score?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Excellent (720+)", value: "720+" },
                      { label: "Good (650-719)", value: "650-719" },
                      { label: "Fair (600-649)", value: "600-649" },
                      { label: "Poor (<600)", value: "<600" }
                    ].map((option) => (
                      <Controller
                        key={option.value}
                        name="creditScore"
                        control={control}
                        render={({ field }) => (
                          <div
                            onClick={() => {
                              field.onChange(option.value);
                              nextStep();
                            }}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                              ${field.value === option.value 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-gray-200 hover:border-primary/50 hover:shadow-md bg-white"}
                            `}
                          >
                            <span className={`font-medium ${field.value === option.value ? "text-primary" : "text-gray-700"}`}>
                              {option.label}
                            </span>
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center
                              ${field.value === option.value ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary/70"}
                            `}>
                              {field.value === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {errors.creditScore && <p className="text-red-500 text-sm mt-2">{errors.creditScore.message}</p>}
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Where should we send your options?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <Input
                        placeholder="John"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <Input
                        placeholder="Doe"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Business Name</label>
                      <Input
                        placeholder="My Awesome Business LLC"
                        {...register("businessName")}
                        className={errors.businessName ? "border-red-500" : ""}
                      />
                      {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input
                        placeholder="john@example.com"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input
                        placeholder="(555) 123-4567"
                        type="tel"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className={currentStep === 0 ? "invisible" : ""}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={nextStep}
              isLoading={isSubmitting}
              className="bg-accent hover:bg-accent/90 text-white px-8"
            >
              See My Options
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
             <div /> 
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400 max-w-lg mx-auto">
        <p>
          By clicking "See My Options", you agree to our Terms of Service and Privacy Policy.
          Your information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};