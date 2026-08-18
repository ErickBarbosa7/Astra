import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Palette, Pencil, Plus, Trash2, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { Skeleton } from "@/components/Skeleton";
import { CATEGORY_COLORS, CATEGORY_TYPES, CATEGORY_TYPE_META } from "../constants";
import { categoryFormSchema, type CategoryFormValues } from "../schemas";
import { useCategoriesStore } from "../store/categoriesStore";
import type { Category, CategoryType } from "../types";

function CategoryForm({
  category,
  onDone,
  onCancel,
}: {
  category: Category | null;
  onDone: () => void;
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
      : { name: "", type: "EXPENSE", color: CATEGORY_COLORS[0] },
  });

  const selectedColor = useWatch({ control, name: "color" });
  const selectedType = useWatch({ control, name: "type" });

  const onSubmit = async (values: CategoryFormValues) => {
    setServerError(null);
    try {
      if (category) {
        await updateCategory(category.id, { name: values.name, type: values.type, color: values.color });
      } else {
        await createCategory({ name: values.name, type: values.type, color: values.color });
      }
      onDone();
    } catch (error) {
      setServerError(getApiErrorMessage(error, "No se pudo guardar la categoría"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("space-y-4", isEdit && "mt-4")}>
      {serverError && (
        <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {CATEGORY_TYPES.map((type) => {
          const meta = CATEGORY_TYPE_META[type];
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setValue("type", type as CategoryType, { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-bold transition-colors",
                isSelected
                  ? type === "INCOME"
                    ? "border-success bg-success-soft text-success"
                    : "border-danger bg-danger-soft text-danger-strong"
                  : "border-ink/10 bg-canvas text-muted hover:border-ink/30 hover:text-foreground",
              )}
            >
              <meta.icon className="h-4 w-4" />
              {meta.label}
            </button>
          );
        })}
      </div>

      <div>
        <label htmlFor="category-name" className="mb-1.5 block text-sm font-medium">
          Nombre
        </label>
        <input
          id="category-name"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink"
          placeholder="Ej. Comida, Sueldo, Transporte"
          {...register("name")}
        />
        {errors.name && <p className="mt-1.5 text-xs font-medium text-danger">{errors.name.message}</p>}
      </div>

      <div>
        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
          <Palette className="h-4 w-4 text-muted" /> Color
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Usar color ${color}`}
              onClick={() => setValue("color", color, { shouldValidate: true })}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
                selectedColor === color && "ring-2 ring-ink ring-offset-2",
              )}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <Check className="h-4 w-4 text-white" style={{ color: color === "#1A1A1A" ? "#FFFFFF" : "#1A1A1A" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full bg-ink/5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-ink/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center rounded-full bg-accent py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}

export function CategoriesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const categories = useCategoriesStore((state) => state.categories);
  const loading = useCategoriesStore((state) => state.loading);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const removeCategory = useCategoriesStore((state) => state.removeCategory);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) void fetchCategories();
  }, [open, fetchCategories]);

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setShowForm(true);
  };

  const confirmRemove = async (category: Category) => {
    setRemovingId(category.id);
    setRemoveError(null);
    try {
      await removeCategory(category.id);
      setConfirmingId(null);
    } catch (error) {
      setRemoveError(getApiErrorMessage(error, "No se pudo eliminar la categoría"));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Categorías" className="max-w-lg">
      <div className="mt-6 space-y-5">
        {removeError && (
          <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong">
            {removeError}
          </div>
        )}

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 bg-canvas px-4 py-3 text-sm font-bold text-muted transition-colors hover:border-accent hover:bg-accent/10 hover:text-foreground"
          >
            <Plus className="h-4 w-4" /> Nueva categoría
          </button>
        )}

        {showForm && (
          <div className="rounded-bento bg-canvas p-5">
            <CategoryForm
              key={editing?.id ?? "new"}
              category={editing}
              onDone={closeForm}
              onCancel={closeForm}
            />
          </div>
        )}

        <div>
          {loading && categories.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-2xl bg-ink/5 p-4">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="rounded-2xl bg-canvas px-4 py-6 text-center text-sm text-muted">
              Aún no tienes categorías. Crea la primera para organizar tus movimientos.
            </p>
          ) : (
            <div className="space-y-2">
              {[...categories]
                .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)))
                .map((category) => {
                  const meta = CATEGORY_TYPE_META[category.type];
                  const confirming = confirmingId === category.id;
                  const removing = removingId === category.id;
                  const isRowEditing = showForm && editing?.id === category.id;

                  if (isRowEditing) {
                    return (
                      <div key={category.id} className="rounded-bento bg-canvas p-5">
                        <CategoryForm
                          category={category}
                          onDone={closeForm}
                          onCancel={closeForm}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-card p-4"
                    >
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-full"
                        aria-hidden
                        style={{ backgroundColor: category.color ?? "#D8FB52" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{category.name}</p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                          category.type === "INCOME"
                            ? "bg-success-soft text-success"
                            : "bg-danger-soft text-danger-strong",
                        )}
                      >
                        <meta.icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          aria-label={`Editar ${category.name}`}
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-ink/5 hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {confirming ? (
                          <div className="flex items-center gap-1 rounded-full bg-danger-soft p-1">
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
                          <button
                            type="button"
                            onClick={() => {
                              setRemoveError(null);
                              setConfirmingId(category.id);
                            }}
                            aria-label={`Eliminar ${category.name}`}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-strong"
                          >
                            {removing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Al eliminar una categoría, los movimientos asociados conservarán su historial sin categoría.
        </p>
      </div>
    </Modal>
  );
}