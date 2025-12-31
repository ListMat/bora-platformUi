import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { RaRecord, UseBulkDeleteControllerParams } from "ra-core";
import { useBulkDeleteController, useTranslate } from "ra-core";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * A button that deletes multiple selected records at once.
 *
 * Allows to delete selected records in a DataTable. Use within
 * the bulkActionsButtons prop of DataTable or inside BulkActionsToolbar.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/bulkdeletebutton/ BulkDeleteButton documentation}
 *
 * @example
 * import { BulkDeleteButton, BulkExportButton, DataTable, List } from '@/components/admin';
 *
 * export const PostList = () => (
 *   <List>
 *     <DataTable
 *       bulkActionsButtons={
 *         <>
 *           <BulkExportButton />
 *           <BulkDeleteButton />
 *         </>
 *       }
 *     >
 *       ...
 *     </DataTable>
 *   </List>
 * );
 */
export const BulkDeleteButton = <
  RecordType extends RaRecord = any,
  MutationOptionsError = unknown,
>({
  icon = defaultIcon,
  label,
  className,
  ...props
}: BulkDeleteButtonProps<RecordType, MutationOptionsError>) => {
  const { handleDelete, isPending } = useBulkDeleteController(props);
  const translate = useTranslate();

  return (
    <Button
      variant="destructive"
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={cn("h-9", className)}
    >
      {icon}
      {translate(label ?? "ra.action.delete", { _: label ?? "Delete" })}
    </Button>
  );
};

export type BulkDeleteButtonProps<
  RecordType extends RaRecord = any,
  MutationOptionsError = unknown,
> = {
  label?: string;
  icon?: ReactNode;
} & React.ComponentPropsWithoutRef<"button"> &
  UseBulkDeleteControllerParams<RecordType, MutationOptionsError>;

const defaultIcon = <Trash />;
