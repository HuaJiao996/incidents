import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServiceCustomFieldPlain = t.Object(
  {
    id: t.Integer(),
    serviceId: t.String(),
    path: t.String(),
    type: t.Union(
      [
        t.Literal("STRING"),
        t.Literal("NUMBER"),
        t.Literal("BOOLEAN"),
        t.Literal("ENUM"),
        t.Literal("DATE"),
        t.Literal("ARRAY"),
      ],
      { additionalProperties: false },
    ),
    required: t.Boolean(),
    enumValues: t.Any(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    createdById: t.String(),
    updatedById: t.String(),
  },
  { additionalProperties: false },
);

export const ServiceCustomFieldRelations = t.Object(
  {
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        description: __nullable__(t.String()),
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

export const ServiceCustomFieldPlainInputCreate = t.Object(
  {
    path: t.String(),
    type: t.Union(
      [
        t.Literal("STRING"),
        t.Literal("NUMBER"),
        t.Literal("BOOLEAN"),
        t.Literal("ENUM"),
        t.Literal("DATE"),
        t.Literal("ARRAY"),
      ],
      { additionalProperties: false },
    ),
    required: t.Optional(t.Boolean()),
    enumValues: t.Optional(t.Any()),
  },
  { additionalProperties: false },
);

export const ServiceCustomFieldPlainInputUpdate = t.Object(
  {
    path: t.Optional(t.String()),
    type: t.Optional(
      t.Union(
        [
          t.Literal("STRING"),
          t.Literal("NUMBER"),
          t.Literal("BOOLEAN"),
          t.Literal("ENUM"),
          t.Literal("DATE"),
          t.Literal("ARRAY"),
        ],
        { additionalProperties: false },
      ),
    ),
    required: t.Optional(t.Boolean()),
    enumValues: t.Optional(t.Any()),
  },
  { additionalProperties: false },
);

export const ServiceCustomFieldRelationsInputCreate = t.Object(
  {
    service: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ServiceCustomFieldRelationsInputUpdate = t.Partial(
  t.Object(
    {
      service: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
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

export const ServiceCustomFieldWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          serviceId: t.String(),
          path: t.String(),
          type: t.Union(
            [
              t.Literal("STRING"),
              t.Literal("NUMBER"),
              t.Literal("BOOLEAN"),
              t.Literal("ENUM"),
              t.Literal("DATE"),
              t.Literal("ARRAY"),
            ],
            { additionalProperties: false },
          ),
          required: t.Boolean(),
          enumValues: t.Any(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "ServiceCustomField" },
  ),
);

export const ServiceCustomFieldWhereUnique = t.Recursive(
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
              serviceId: t.String(),
              path: t.String(),
              type: t.Union(
                [
                  t.Literal("STRING"),
                  t.Literal("NUMBER"),
                  t.Literal("BOOLEAN"),
                  t.Literal("ENUM"),
                  t.Literal("DATE"),
                  t.Literal("ARRAY"),
                ],
                { additionalProperties: false },
              ),
              required: t.Boolean(),
              enumValues: t.Any(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              createdById: t.String(),
              updatedById: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ServiceCustomField" },
);

export const ServiceCustomFieldSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      serviceId: t.Boolean(),
      service: t.Boolean(),
      path: t.Boolean(),
      type: t.Boolean(),
      required: t.Boolean(),
      enumValues: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdById: t.Boolean(),
      updatedById: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceCustomFieldInclude = t.Partial(
  t.Object(
    { service: t.Boolean(), type: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ServiceCustomFieldOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      path: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      required: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enumValues: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ServiceCustomField = t.Composite(
  [ServiceCustomFieldPlain, ServiceCustomFieldRelations],
  { additionalProperties: false },
);

export const ServiceCustomFieldInputCreate = t.Composite(
  [ServiceCustomFieldPlainInputCreate, ServiceCustomFieldRelationsInputCreate],
  { additionalProperties: false },
);

export const ServiceCustomFieldInputUpdate = t.Composite(
  [ServiceCustomFieldPlainInputUpdate, ServiceCustomFieldRelationsInputUpdate],
  { additionalProperties: false },
);
