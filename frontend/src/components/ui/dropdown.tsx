import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  panelClassName?: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Selecciona...",
  disabled = false,
  className,
  panelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const moveHighlight = (direction: 1 | -1) => {
    setHighlight((current) => {
      const last = options.length - 1;
      if (current === -2) return direction === 1 ? 0 : last;
      const next = current + direction;
      if (next < 0) return last;
      if (next > last) return 0;
      return next;
    });
  };

  const selectHighlight = () => {
    const option = options[highlight === -1 ? 0 : highlight];
    if (option) {
      onChange(option.value);
      setOpen(false);
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight(options.length > 0 ? 0 : -2);
      setOpen(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight(options.length > 0 ? options.length - 1 : -2);
      setOpen(true);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
      if (options[0]) setHighlight(0);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectHighlight();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          setOpen((current) => !current);
          if (!open && options[0] !== undefined) setHighlight(0);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-2xl border border-ink/10 bg-canvas px-4 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          open ? "border-ink" : "focus:border-ink",
          selected ? "py-2.5 text-foreground" : "py-2.5 text-muted-foreground",
        )}
      >
        <span className="min-w-0 truncate text-left">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-150 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          onMouseDown={(event) => event.stopPropagation()}
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-bento border border-ink/5 bg-card p-1.5 shadow-2xl",
            panelClassName,
          )}
        >
          {options.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Sin opciones</p>
          ) : (
            options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlight;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm transition-colors",
                    isSelected ? "bg-accent font-bold text-foreground" : "text-foreground",
                    !isSelected && isHighlighted && "bg-ink/5",
                  )}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
