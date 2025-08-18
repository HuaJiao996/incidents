import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CustomFieldType = t.Union(
  [
    t.Literal("STRING"),
    t.Literal("NUMBER"),
    t.Literal("BOOLEAN"),
    t.Literal("ENUM"),
    t.Literal("DATE"),
    t.Literal("ARRAY"),
  ],
  { additionalProperties: false },
);
