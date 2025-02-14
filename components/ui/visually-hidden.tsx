interface VisuallyHiddenProps {
    children: React.ReactNode;
    className?: string;
}

const VisuallyHidden = ({
    children,
    className,
}: VisuallyHiddenProps) => {
    return (
        <span
            className={`
          absolute
          h-px
          w-px
          overflow-hidden
          whitespace-nowrap
          border-0
          p-0
          -m-px
          [clip:rect(0,0,0,0)]
          ${className || ""}
        `}
        >
            {children}
        </span>
    );
};

export { VisuallyHidden };