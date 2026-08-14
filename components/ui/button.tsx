import React, { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-4.5 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    }

    const variantStyles = {
      primary:
        'bg-[#1F4D2C] hover:bg-[#173C22] text-white shadow-sm hover:shadow focus:ring-[#1F4D2C]/40',
      secondary:
        'bg-[#3D6E4B] hover:bg-[#2F593B] text-white shadow-sm focus:ring-[#3D6E4B]/40',
      gold:
        'bg-[#C89726] hover:bg-[#B3851E] text-white shadow-sm focus:ring-[#C89726]/40',
      outline:
        'border border-[#E2E0D4] bg-white hover:bg-[#F8F7F2] text-[#1A261D] shadow-xs focus:ring-[#1F4D2C]/30',
      danger:
        'bg-red-700 hover:bg-red-800 text-white shadow-xs focus:ring-red-500',
      ghost:
        'text-[#526356] hover:text-[#1A261D] hover:bg-[#EAF2EB] focus:ring-[#1F4D2C]/20',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
