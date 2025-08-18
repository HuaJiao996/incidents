import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const IncidentTypePlain = t.Object(
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
);

export const IncidentTypeRelations = t.Object(
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
    severityConditions: t.Array(
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

export const IncidentTypePlainInputCreate = t.Object(
  {
    name: t.String(),
    title: t.String(),
    description: t.String(),
    condition: t.String(),
    groupCondition: t.Optional(__nullable__(t.String())),
    priority: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const IncidentTypePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    condition: t.Optional(t.String()),
    groupCondition: t.Optional(__nullable__(t.String())),
    priority: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const IncidentTypeRelationsInputCreate = t.Object(
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
    severityConditions: t.Optional(
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

export const IncidentTypeRelationsInputUpdate = t.Partial(
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
      severityConditions: t.Partial(
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

export const IncidentTypeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          name: t.String(),
          serviceId: t.String(),
          title: t.String(),
          description: t.String(),
          condition: t.String(),
          groupCondition: t.String(),
          priority: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "IncidentType" },
  ),
);

export const IncidentTypeWhereUnique = t.Recursive(
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
              name: t.String(),
              serviceId: t.String(),
              title: t.String(),
              description: t.String(),
              condition: t.String(),
              groupCondition: t.String(),
              priority: t.Integer(),
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
  { $id: "IncidentType" },
);

export const IncidentTypeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      serviceId: t.Boolean(),
      service: t.Boolean(),
      title: t.Boolean(),
      description: t.Boolean(),
      condition: t.Boolean(),
      groupCondition: t.Boolean(),
      severityConditions: t.Boolean(),
      priority: t.Boolean(),
      incidents: t.Boolean(),
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

export const IncidentTypeInclude = t.Partial(
  t.Object(
    {
      service: t.Boolean(),
      severityConditions: t.Boolean(),
      incidents: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const IncidentTypeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      condition: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      groupCondition: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priority: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const IncidentType = t.Composite(
  [IncidentTypePlain, IncidentTypeRelations],
  { additionalProperties: false },
);

export const IncidentTypeInputCreate = t.Composite(
  [IncidentTypePlainInputCreate, IncidentTypeRelationsInputCreate],
  { additionalProperties: false },
);

export const IncidentTypeInputUpdate = t.Composite(
  [IncidentTypePlainInputUpdate, IncidentTypeRelationsInputUpdate],
  { additionalProperties: false },
);
