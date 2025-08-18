import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServicePlain = t.Object(
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
);

export const ServiceRelations = t.Object(
  {
    routes: t.Array(
      t.Object(
        {
          id: t.Integer(),
          serviceId: t.String(),
          order: t.Integer(),
          condition: t.String(),
          description: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    customFields: t.Array(
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
      { additionalProperties: false },
    ),
    incidents: t.Array(
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
      { additionalProperties: false },
    ),
    incidentTypes: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    alerts: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
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

export const ServicePlainInputCreate = t.Object(
  { name: t.String(), description: t.Optional(__nullable__(t.String())) },
  { additionalProperties: false },
);

export const ServicePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ServiceRelationsInputCreate = t.Object(
  {
    routes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    customFields: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    incidents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    incidentTypes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    alerts: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
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

export const ServiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      routes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      customFields: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      incidents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      incidentTypes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      alerts: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
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

export const ServiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          description: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Service" },
  ),
);

export const ServiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), name: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ name: t.String() })],
          { additionalProperties: false },
        ),
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
              id: t.String(),
              name: t.String(),
              description: t.String(),
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
  { $id: "Service" },
);

export const ServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      description: t.Boolean(),
      routes: t.Boolean(),
      customFields: t.Boolean(),
      incidents: t.Boolean(),
      incidentTypes: t.Boolean(),
      alerts: t.Boolean(),
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

export const ServiceInclude = t.Partial(
  t.Object(
    {
      routes: t.Boolean(),
      customFields: t.Boolean(),
      incidents: t.Boolean(),
      incidentTypes: t.Boolean(),
      alerts: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Service = t.Composite([ServicePlain, ServiceRelations], {
  additionalProperties: false,
});

export const ServiceInputCreate = t.Composite(
  [ServicePlainInputCreate, ServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const ServiceInputUpdate = t.Composite(
  [ServicePlainInputUpdate, ServiceRelationsInputUpdate],
  { additionalProperties: false },
);
