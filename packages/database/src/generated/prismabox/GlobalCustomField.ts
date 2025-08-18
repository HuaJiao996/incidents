import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GlobalCustomFieldPlain = t.Object(
  {
    id: t.Integer(),
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
    enumValues: __nullable__(t.Any()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    createdById: t.String(),
    updatedById: t.String(),
  },
  { additionalProperties: false },
);

export const GlobalCustomFieldRelations = t.Object(
  {
    createdBy: t.Object(
      {
        id: t.String(),
        name: t.String(),
        email: t.String(),
        emailVerified: t.Boolean(),
        image: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        role: __nullable__(t.String()),
        banned: __nullable__(t.Boolean()),
        banReason: __nullable__(t.String()),
        banExpires: __nullable__(t.Date()),
      },
      { additionalProperties: false },
    ),
    updatedBy: t.Object(
      {
        id: t.String(),
        name: t.String(),
        email: t.String(),
        emailVerified: t.Boolean(),
        image: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        role: __nullable__(t.String()),
        banned: __nullable__(t.Boolean()),
        banReason: __nullable__(t.String()),
        banExpires: __nullable__(t.Date()),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const GlobalCustomFieldPlainInputCreate = t.Object(
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
    enumValues: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const GlobalCustomFieldPlainInputUpdate = t.Object(
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
    enumValues: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const GlobalCustomFieldRelationsInputCreate = t.Object(
  {
    createdBy: t.Object(
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
    updatedBy: t.Object(
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

export const GlobalCustomFieldRelationsInputUpdate = t.Partial(
  t.Object(
    {
      createdBy: t.Object(
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
      updatedBy: t.Object(
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

export const GlobalCustomFieldWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
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
    { $id: "GlobalCustomField" },
  ),
);

export const GlobalCustomFieldWhereUnique = t.Recursive(
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
  { $id: "GlobalCustomField" },
);

export const GlobalCustomFieldSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      path: t.Boolean(),
      type: t.Boolean(),
      required: t.Boolean(),
      enumValues: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdById: t.Boolean(),
      updatedById: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const GlobalCustomFieldInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const GlobalCustomFieldOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const GlobalCustomField = t.Composite(
  [GlobalCustomFieldPlain, GlobalCustomFieldRelations],
  { additionalProperties: false },
);

export const GlobalCustomFieldInputCreate = t.Composite(
  [GlobalCustomFieldPlainInputCreate, GlobalCustomFieldRelationsInputCreate],
  { additionalProperties: false },
);

export const GlobalCustomFieldInputUpdate = t.Composite(
  [GlobalCustomFieldPlainInputUpdate, GlobalCustomFieldRelationsInputUpdate],
  { additionalProperties: false },
);
