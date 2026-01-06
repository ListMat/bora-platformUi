import * as React from "react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onCheckedChange) {
                onCheckedChange(e.target.checked)
            }
            if (props.onChange) {
                props.onChange(e)
            }
        }

        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-primary bg-background transition-all checked:bg-primary checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={handleChange}
                    {...props}
                />
                {/* Check icon - usando Unicode checkmark */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-5 w-5 p-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
