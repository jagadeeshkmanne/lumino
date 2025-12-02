/**
 * Lumino Framework - React Hooks Exports
 */

// Form
export { useForm } from "./useForm";
export type { UseFormOptions, UseFormReturn } from "./useForm";

// Page
export { usePage, useNavigationGuard } from "./usePage";
export type { UsePageOptions, UsePageReturn } from "./usePage";

// API
export { useApi, useLazyApi, useMutation, useQueries } from "./useApi";
export type {
  UseApiOptions,
  UseApiReturn,
  UseMutationOptions,
  UseMutationReturn,
  UseQueriesResult,
} from "./useApi";

// Store
export {
  useEntity,
  useCollection,
  useStateSelector,
  useLoading,
  useApiLoading,
  useFormLoading,
  useFormData,
  usePageLoading,
  useLocale,
  useTheme,
  useUser,
  useMeta,
} from "./useStore";
export type {
  UseEntityOptions,
  UseEntityReturn,
  UseCollectionOptions,
  UseCollectionReturn,
} from "./useStore";

// Lumino
export {
  useLumino,
  useNavigation,
  useNotify,
  useI18n,
  useEvents,
} from "./useLumino";
export type { UseLuminoReturn } from "./useLumino";
