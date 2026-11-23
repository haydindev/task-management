
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

type CreateTaskInput = {
  title: string;
};

type UpdateTaskInput = {
  title?: string;
  completed?: boolean;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function validateCreateTask(
  body: unknown
): ValidationResult<CreateTaskInput> {
  const title = isObject(body) ? body.title : undefined;

  if (typeof title !== "string" || title.trim() === "") {
    return {
      success: false,
      message: "Geçerli bir görev başlığı gerekli.",
    };
  }

  return {
    success: true,
    data: { title: title.trim() },
  };
}

export function validateUpdateTask(
  body: unknown
): ValidationResult<UpdateTaskInput> {
  if (!isObject(body)) {
    return {
      success: false,
      message: "Güncellenecek alan belirtilmedi.",
    };
  }

  const { title, completed } = body;

  if (title === undefined && completed === undefined) {
    return {
      success: false,
      message: "Güncellenecek alan belirtilmedi.",
    };
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return {
      success: false,
      message: "Geçerli bir görev başlığı gerekli.",
    };
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return {
      success: false,
      message: "completed alanı boolean olmalıdır.",
    };
  }

  const data: UpdateTaskInput = {};

  if (typeof title === "string") {
    data.title = title.trim();
  }

  if (typeof completed === "boolean") {
    data.completed = completed;
  }

  return {
    success: true,
    data,
  };
}
