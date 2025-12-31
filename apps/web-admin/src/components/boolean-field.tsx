import * as React from "react";
import type { RaRecord } from "ra-core";
import { useFieldValue, useTranslate } from "ra-core";
import { Badge } from "@/components/ui/badge";
import type { FieldProps } from "@/lib/field.type";

/**
 * Displays a boolean value as a badge.
 */
export const BooleanField = <RecordType extends RaRecord = RaRecord>({
  defaultValue,
  source,
  record,
  empty,
  ...rest
}: BooleanFieldProps<RecordType>) => {
  const value = useFieldValue({ defaultValue, source, record });
  const translate = useTranslate();

  if (value == null) {
    return empty && typeof empty === "string"
      ? translate(empty, { _: empty })
      : empty || null;
  }

  return (
    <Badge variant={value ? "default" : "secondary"} {...rest}>
      {value ? "Sim" : "Não"}
    </Badge>
  );
};

export interface BooleanFieldProps<RecordType extends RaRecord = RaRecord>
  extends FieldProps<RecordType> {}

