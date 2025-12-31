import * as React from "react";
import type { RaRecord } from "ra-core";
import { useFieldValue, useTranslate } from "ra-core";
import type { FieldProps } from "@/lib/field.type";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/**
 * Displays an image from a URL field.
 */
export const ImageField = <RecordType extends RaRecord = RaRecord>({
  defaultValue,
  source,
  record,
  empty,
  ...rest
}: ImageFieldProps<RecordType>) => {
  const value = useFieldValue({ defaultValue, source, record });
  const translate = useTranslate();

  if (value == null || value === "") {
    return empty && typeof empty === "string"
      ? translate(empty, { _: empty })
      : empty || null;
  }

  return (
    <Avatar {...rest}>
      <AvatarImage src={value} alt={source} />
      <AvatarFallback>IMG</AvatarFallback>
    </Avatar>
  );
};

export interface ImageFieldProps<RecordType extends RaRecord = RaRecord>
  extends FieldProps<RecordType> {}

