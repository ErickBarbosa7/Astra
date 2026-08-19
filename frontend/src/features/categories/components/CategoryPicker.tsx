import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "../constants";
import { categoryFormSchema, type CategoryFormValues } from "../schemas";
import { useCategoriesStore } from "../store/categoriesStore";
import type { Category, CategoryType } from "../types";

function CategoryInlineForm({
  category,
  type,
  onDone,
  onCancel,
}: {
  category: Category | null;
  type: CategoryType;
  onDone: (createdId?: string) => void;
  onCancel: () => void;
}) {
  const createCategory = useCategoriesStore((state) => state.createCategory);
  const updateCategory = useCategoriesStore((state) => state.updateCategory);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category
      ? { name: category.name, type: category.type, color: category.color ?? CATEGORY_COLORS[0] }
      : { name: "", type, color: CATEGORY_COLORS[0] },
  });

  const selectedColor = useWatch({ control, name: "color" });

  const onSubmit = async (values: CategoryFormValues) => {
    setServerError(null);
    try {
      if (category) {
        await updateCategory(category.id, { name: values.name, type: values.type, color: values.color });
      } else {
        const created = await createCategory({ name: values.name, type: values.type, color: values.color });
        onDone(created.id);
        return;
      }
      onDone();
    } catch (error) {
      setServerError(getApiErrorMessage(error, "No se pudo guardar la categoría"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      {serverError && (
        <div className="rounded-xl bg-danger-soft px-3 py-2 text-xs font-medium text-danger-strong">
          {serverError}
        </div>
      )}

      <div>
        <input
          autoFocus
          placeholder="Nombre de la categoría"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-xs font-medium text-danger">{errors.name.message}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORY_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Usar color ${color}`}
            onClick={() => setValue("color", color, { shouldValidate: true })}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110",
              selectedColor === color && "ring-2 ring-ink ring-offset-1",
            )}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && <Check className="h-3 w-3" style={{ color: color === "#1A1A1A" ? "#FFFFFF" : "#1A1A1A" }} />}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full bg-ink/5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-ink/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2 text-xs font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isEdit ? "Guardar" : "Crear"}
        </button>
      </div>
    </form>
  );
}

export interface CategoryPickerProps {
  value: string;
  onChange: (value: string) => void;
  type: CategoryType;
  allowEmpty?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CategoryPicker({
  value,
  onChange,
  type,
  allowEmpty = true,
  placeholder = "Selecciona una categoría",
  disabled = false,
  className,
}: CategoryPickerProps) {
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const removeCategory = useCategoriesStore((state) => state.removeCategory);

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const [editing, setEditing] = useState<
    null | { mode: "create" } | { mode: "edit"; category: Category }
  >(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const filtered = categories.filter((category) => category.type === type);
  const selected = filtered.find((category) => category.id === value);
  const optionIds = [...(allowEmpty ? [""] : []), ...filtered.map((category) => category.id)];

  useEffect(() => {
    if (open) void fetchCategories();
  }, [open, fetchCategories]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setEditing(null);
        setConfirmingId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setEditing(null);
        setConfirmingId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectOption = (optionId: string) => {
    onChange(optionId);
    setOpen(false);
    setEditing(null);
    setConfirmingId(null);
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (editing || confirmingId) return;
    setHighlight((current) => {
      const last = optionIds.length - 1;
      if (current === -2) return direction === 1 ? 0 : last;
      const next = current + direction;
      if (next < 0) return last;
      if (next > last) return 0;
      return next;
    });
  };

  const selectHighlight = () => {
    if (editing || confirmingId) return;
    const optionId = optionIds[highlight === -1 ? 0 : highlight];
    if (optionId !== undefined) selectOption(optionId);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight(optionIds.length > 0 ? 0 : -2);
      setOpen(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight(optionIds.length > 0 ? optionIds.length - 1 : -2);
      setOpen(true);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
      if (optionIds[0] !== undefined) setHighlight(0);
    }
  };

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      if (!editing) {
        event.preventDefault();
        selectHighlight();
      }
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const startEdit = (category: Category) => {
    setRemoveError(null);
    setConfirmingId(null);
    setEditing({ mode: "edit", category });
  };

  const confirmRemove = async (category: Category) => {
    setRemovingId(category.id);
    setRemoveError(null);
    try {
      await removeCategory(category.id);
      if (value === category.id) onChange("");
      setConfirmingId(null);
    } catch (error) {
      setRemoveError(getApiErrorMessage(error, "No se pudo eliminar la categoría"));
    } finally {
      setRemovingId(null);
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
          if (!open && optionIds[0] !== undefined) setHighlight(0);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-2xl border border-ink/10 bg-canvas px-4 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          open ? "border-ink" : "focus:border-ink",
          "py-2.5",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: selected.color ?? "#D8FB52" }}
              />
              <span className="truncate text-foreground">{selected.name}</span>
            </>
          ) : (
            <span className="truncate text-muted-foreground">
              {value === "" ? placeholder : "Categoría no disponible"}
            </span>
          )}
        </span>
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
          onKeyDown={handlePanelKeyDown}
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-bento border border-ink/5 bg-card p-1.5 shadow-2xl"
        >
          <div className="max-h-72 overflow-y-auto">
            {editing && (
              <div className="border-b border-ink/5 px-1 pb-2.5 pt-1">
                <CategoryInlineForm
                  key={editing.mode === "edit" ? editing.category.id : "new"}
                  category={editing.mode === "edit" ? editing.category : null}
                  type={type}
                  onDone={(createdId) => {
                    setEditing(null);
                    if (createdId) onChange(createdId);
                  }}
                  onCancel={() => setEditing(null)}
                />
              </div>
            )}

            {allowEmpty && (
              <button
                key="__empty__"
                type="button"
                role="option"
                aria-selected={value === ""}
                onClick={() => selectOption("")}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm transition-colors",
                  value === "" ? "bg-accent font-bold text-foreground" : "text-muted-foreground",
                )}
              >
                <span>Sin categoría</span>
                {value === "" && <Check className="h-4 w-4 shrink-0" />}
              </button>
            )}

            {filtered.length === 0 && !editing && (
              <p className="px-3.5 py-3 text-sm text-muted-foreground">Aún no hay categorías</p>
            )}

            {filtered.map((category, index) => {
              const isSelected = category.id === value;
              const isHighlighted = index === highlight;
              const confirming = confirmingId === category.id;
              const removing = removingId === category.id;

              return (
                <div
                  key={category.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-2xl",
                    isHighlighted && "bg-ink/5",
                  )}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(category.id)}
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-3.5 py-2.5 text-left text-sm transition-colors",
                      isSelected ? "bg-accent font-bold text-foreground" : "text-foreground",
                    )}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color ?? "#D8FB52" }}
                    />
                    <span className="min-w-0 flex-1 truncate">{category.name}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>

                  {confirming ? (
                    <div className="mr-1 flex shrink-0 items-center gap-1 rounded-full bg-danger-soft p-1">
                      <button
                        type="button"
                        onClick={() => void confirmRemove(category)}
                        disabled={removing}
                        className="rounded-full bg-danger px-2.5 py-1 text-xs font-bold text-white hover:opacity-90 disabled:opacity-60"
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        aria-label="Cancelar"
                        className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="mr-1 flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        aria-label={`Editar ${category.name}`}
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-ink/5 hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveError(null);
                          setConfirmingId(category.id);
                        }}
                        aria-label={`Eliminar ${category.name}`}
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-strong"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-1.5 border-t border-ink/5 pt-1.5">
            {removeError && (
              <p className="px-2 pb-1 text-xs font-medium text-danger">{removeError}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setRemoveError(null);
                setConfirmingId(null);
                setEditing({ mode: "create" });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-muted transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-4 w-4" /> Nueva categoría
            </button>
          </div>
        </div>
      )}
    </div>
  );
}