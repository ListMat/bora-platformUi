import * as React from "react";
import type { RaRecord } from "ra-core";
import { useFieldValue, useTranslate } from "ra-core";
import { Badge } from "@/components/ui/badge";
import type { FieldProps } from "@/lib/field.type";

/**
 * Displays a value as a chip/badge.
 */
export const ChipField = <RecordType extends RaRecord = RaRecord>({
  defaultValue,
  source,
  record,
  empty,
  ...rest
}: ChipFieldProps<RecordType>) => {
  const value = useFieldValue({ defaultValue, source, record });
  const translate = useTranslate();

  if (value == null || value === "") {
    return empty && typeof empty === "string"
      ? translate(empty, { _: empty })
      : empty || null;
  }

  return (
    <Badge variant="outline" {...rest}>
      {typeof value !== "string" ? value.toString() : value}
    </Badge>
  );
};

export interface ChipFieldProps<RecordType extends RaRecord = RaRecord>
  extends FieldProps<RecordType> {}

