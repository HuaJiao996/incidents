import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const IncidentStatus = t.Union(
  [t.Literal("OPEN"), t.Literal("ACKNOWLEDGED"), t.Literal("RESOLVED")],
  { additionalProperties: false },
);
