import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AlertPlain = t.Object(
  {
    id: t.Integer(),
    title: t.String(),
    content: t.String(),
    customFields: __nullable__(t.Any()),
    serviceId: t.String(),
    incidentId: __nullable__(t.Integer()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    createdById: t.String(),
  },
  { additionalProperties: false },
);

export const AlertRelations = t.Object(
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
    incident: __nullable__(
      t.Object(
        {
          id: t.Integer(),
          title: t.String(),
          description: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("OPEN"),
              t.Literal("ACKNOWLEDGED"),
              t.Literal("RESOLVED"),
            ],
            { additionalProperties: false },
          ),
          severity: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("CRITICAL"),
            ],
            { additionalProperties: false },
          ),
          serviceId: t.String(),
          typeId: __nullable__(t.Integer()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
    ),
    createdBy: t.Object(
      {
        id: t.String(),
        name: __nullable__(t.String()),
        start: __nullable__(t.String()),
        prefix: __nullable__(t.String()),
        key: t.String(),
        userId: t.String(),
        refillInterval: __nullable__(t.Integer()),
        refillAmount: __nullable__(t.Integer()),
        lastRefillAt: __nullable__(t.Date()),
        enabled: __nullable__(t.Boolean()),
        rateLimitEnabled: __nullable__(t.Boolean()),
        rateLimitTimeWindow: __nullable__(t.Integer()),
        rateLimitMax: __nullable__(t.Integer()),
        requestCount: __nullable__(t.Integer()),
        remaining: __nullable__(t.Integer()),
        lastRequest: __nullable__(t.Date()),
        expiresAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        permissions: __nullable__(t.String()),
        metadata: __nullable__(t.String()),
        createdById: t.String(),
        updatedById: t.String(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AlertPlainInputCreate = t.Object(
  {
    title: t.String(),
    content: t.String(),
    customFields: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const AlertPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    content: t.Optional(t.String()),
    customFields: t.Optional(__nullable__(t.Any())),
  },
  { additionalProperties: false },
);

export const AlertRelationsInputCreate = t.Object(
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
    incident: t.Optional(
      t.Object(
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
    ),
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
  },
  { additionalProperties: false },
);

export const AlertRelationsInputUpdate = t.Partial(
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
      incident: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
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
    },
    { additionalProperties: false },
  ),
);

export const AlertWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          title: t.String(),
          content: t.String(),
          customFields: t.Any(),
          serviceId: t.String(),
          incidentId: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Alert" },
  ),
);

export const AlertWhereUnique = t.Recursive(
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
              title: t.String(),
              content: t.String(),
              customFields: t.Any(),
              serviceId: t.String(),
              incidentId: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              createdById: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Alert" },
);

export const AlertSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      title: t.Boolean(),
      content: t.Boolean(),
      customFields: t.Boolean(),
      serviceId: t.Boolean(),
      service: t.Boolean(),
      incidentId: t.Boolean(),
      incident: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdById: t.Boolean(),
      createdBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AlertInclude = t.Partial(
  t.Object(
    {
      service: t.Boolean(),
      incident: t.Boolean(),
      createdBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AlertOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customFields: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      incidentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    },
    { additionalProperties: false },
  ),
);

export const Alert = t.Composite([AlertPlain, AlertRelations], {
  additionalProperties: false,
});

export const AlertInputCreate = t.Composite(
  [AlertPlainInputCreate, AlertRelationsInputCreate],
  { additionalProperties: false },
);

export const AlertInputUpdate = t.Composite(
  [AlertPlainInputUpdate, AlertRelationsInputUpdate],
  { additionalProperties: false },
);
