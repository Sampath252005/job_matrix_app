import toast from "react-hot-toast";

type ApiErrorShape = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
};

export const getToastMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiErrorShape;

  return (
    apiError?.response?.data?.message ||
    apiError?.response?.data?.error ||
    apiError?.message ||
    fallback
  );
};

export const toastWarning = (message: string) => {
  toast.error(message);
};

export const toastApiWarning = (error: unknown, fallback: string) => {
  toastWarning(getToastMessage(error, fallback));
};
