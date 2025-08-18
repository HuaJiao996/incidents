import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const IncidentTypeSeverityConditionPlain = t.Object(
  {
    id: t.Integer(),
    severity: t.Union(
      [
        t.Literal("LOW"),
        t.Literal("MEDIUM"),
        t.Literal("HIGH"),
        t.Literal("CRITICAL"),
      ],
      { additionalProperties: false },
    ),
    incidentTypeId: t.Integer(),
    condition: t.String(),
    order: t.Integer(),
  },
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionRelations = t.Object(
  {
    incidentType: t.Object(
      {
        id: t.Integer(),
        name: t.String(),
        serviceId: t.String(),
        title: t.String(),
        description: t.String(),
        condition: t.String(),
        groupCondition: __nullable__(t.String()),
        priority: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        createdById: t.String(),
        updatedById: t.String(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionPlainInputCreate = t.Object(
  {
    severity: t.Union(
      [
        t.Literal("LOW"),
        t.Literal("MEDIUM"),
        t.Literal("HIGH"),
        t.Literal("CRITICAL"),
      ],
      { additionalProperties: false },
    ),
    condition: t.String(),
    order: t.Integer(),
  },
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionPlainInputUpdate = t.Object(
  {
    severity: t.Optional(
      t.Union(
        [
          t.Literal("LOW"),
          t.Literal("MEDIUM"),
          t.Literal("HIGH"),
          t.Literal("CRITICAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    condition: t.Optional(t.String()),
    order: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionRelationsInputCreate = t.Object(
  {
    incidentType: t.Object(
      {
        connect: t.Object(
          {
            id: t.Integer({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      incidentType: t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const IncidentTypeSeverityConditionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          severity: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("CRITICAL"),
            ],
            { additionalProperties: false },
          ),
          incidentTypeId: t.Integer(),
          condition: t.String(),
          order: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "IncidentTypeSeverityCondition" },
  ),
);

export const IncidentTypeSeverityConditionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.Integer() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.Integer() })], {
          additionalProperties: false,
        }),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.Integer(),
              severity: t.Union(
                [
                  t.Literal("LOW"),
                  t.Literal("MEDIUM"),
                  t.Literal("HIGH"),
                  t.Literal("CRITICAL"),
                ],
                { additionalProperties: false },
              ),
              incidentTypeId: t.Integer(),
              condition: t.String(),
              order: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "IncidentTypeSeverityCondition" },
);

export const IncidentTypeSeverityConditionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      severity: t.Boolean(),
      incidentTypeId: t.Boolean(),
      incidentType: t.Boolean(),
      condition: t.Boolean(),
      order: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const IncidentTypeSeverityConditionInclude = t.Partial(
  t.Object(
    { severity: t.Boolean(), incidentType: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const IncidentTypeSeverityConditionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      incidentTypeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      condition: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const IncidentTypeSeverityCondition = t.Composite(
  [IncidentTypeSeverityConditionPlain, IncidentTypeSeverityConditionRelations],
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionInputCreate = t.Composite(
  [
    IncidentTypeSeverityConditionPlainInputCreate,
    IncidentTypeSeverityConditionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const IncidentTypeSeverityConditionInputUpdate = t.Composite(
  [
    IncidentTypeSeverityConditionPlainInputUpdate,
    IncidentTypeSeverityConditionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
