import { X } from "lucide-react";
import { useTranslate } from "ra-core";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

/**
 * A button that navigates back to the previous page.
 *
 * Commonly used in form toolbars alongside SaveButton.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/cancelbutton/ CancelButton documentation}
 *
 * @example
 * import { CancelButton, SaveButton, SimpleForm } from '@/components/admin';
 *
 * const FormToolbar = () => (
 *   <div className="flex flex-row gap-2 justify-end">
 *     <CancelButton />
 *     <SaveButton />
 *   </div>
 * );
 *
 * const PostEdit = () => (
 *   <Edit>
 *     <SimpleForm toolbar={<FormToolbar />}>
 *       ...
 *     </SimpleForm>
 *   </Edit>
 * );
 */
export function CancelButton(props: React.ComponentProps<"button">) {
  const navigate = useNavigate();
  const translate = useTranslate();
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => navigate(-1)}
      className="cursor-pointer"
      {...props}
    >
      <X />
      {translate("ra.action.cancel", { _: "Cancel" })}
    </Button>
  );
}
