import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-dark-cyan text-white shadow hover:bg-dark-cyan/90 hover:shadow-dark-cyan/20",
                destructive:
                    "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-xl px-3 text-xs",
                lg: "h-14 rounded-2xl px-10 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        // If we're using Radix Slot (for polymorphism), we need that package.
        // For now, I'll assume standard button usage to avoid extra deps if Radix isn't installed.
        // Actually, I'll remove Slot usage for simplicity as strictly requested "avoid redundant codes" 
        // and I don't see radix-ui in package.json.

        // const Comp = asChild ? Slot : "button"
        const Comp = "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
