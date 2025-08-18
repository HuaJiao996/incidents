import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const IncidentPlain = t.Object(
  {
    id: t.Integer(),
    title: t.String(),
    description: __nullable__(t.String()),
    status: t.Union(
      [t.Literal("OPEN"), t.Literal("ACKNOWLEDGED"), t.Literal("RESOLVED")],
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
);

export const IncidentRelations = t.Object(
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
    type: __nullable__(
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
    updatedBy: t.Object(
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

export const IncidentPlainInputCreate = t.Object(
  {
    title: t.String(),
    description: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("OPEN"), t.Literal("ACKNOWLEDGED"), t.Literal("RESOLVED")],
        { additionalProperties: false },
      ),
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
  },
  { additionalProperties: false },
);

export const IncidentPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("OPEN"), t.Literal("ACKNOWLEDGED"), t.Literal("RESOLVED")],
        { additionalProperties: false },
      ),
    ),
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
  },
  { additionalProperties: false },
);

export const IncidentRelationsInputCreate = t.Object(
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
    type: t.Optional(
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

export const IncidentRelationsInputUpdate = t.Partial(
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
      type: t.Partial(
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

export const IncidentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          title: t.String(),
          description: t.String(),
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
          typeId: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Incident" },
  ),
);

export const IncidentWhereUnique = t.Recursive(
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
              description: t.String(),
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
              typeId: t.Integer(),
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
  { $id: "Incident" },
);

export const IncidentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      title: t.Boolean(),
      description: t.Boolean(),
      status: t.Boolean(),
      severity: t.Boolean(),
      serviceId: t.Boolean(),
      service: t.Boolean(),
      typeId: t.Boolean(),
      type: t.Boolean(),
      alerts: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      createdById: t.Boolean(),
      createdBy: t.Boolean(),
      updatedById: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const IncidentInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      severity: t.Boolean(),
      service: t.Boolean(),
      type: t.Boolean(),
      alerts: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const IncidentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Incident = t.Composite([IncidentPlain, IncidentRelations], {
  additionalProperties: false,
});

export const IncidentInputCreate = t.Composite(
  [IncidentPlainInputCreate, IncidentRelationsInputCreate],
  { additionalProperties: false },
);

export const IncidentInputUpdate = t.Composite(
  [IncidentPlainInputUpdate, IncidentRelationsInputUpdate],
  { additionalProperties: false },
);
