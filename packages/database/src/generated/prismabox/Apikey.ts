import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ApikeyPlain = t.Object(
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
);

export const ApikeyRelations = t.Object(
  {
    user: t.Object(
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
    createdAlerts: t.Array(
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
    createdIncidents: t.Array(
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
    updatedIncidents: t.Array(
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

export const ApikeyPlainInputCreate = t.Object(
  {
    name: t.Optional(__nullable__(t.String())),
    start: t.Optional(__nullable__(t.String())),
    prefix: t.Optional(__nullable__(t.String())),
    key: t.String(),
    refillInterval: t.Optional(__nullable__(t.Integer())),
    refillAmount: t.Optional(__nullable__(t.Integer())),
    lastRefillAt: t.Optional(__nullable__(t.Date())),
    enabled: t.Optional(__nullable__(t.Boolean())),
    rateLimitEnabled: t.Optional(__nullable__(t.Boolean())),
    rateLimitTimeWindow: t.Optional(__nullable__(t.Integer())),
    rateLimitMax: t.Optional(__nullable__(t.Integer())),
    requestCount: t.Optional(__nullable__(t.Integer())),
    remaining: t.Optional(__nullable__(t.Integer())),
    lastRequest: t.Optional(__nullable__(t.Date())),
    expiresAt: t.Optional(__nullable__(t.Date())),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    permissions: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ApikeyPlainInputUpdate = t.Object(
  {
    name: t.Optional(__nullable__(t.String())),
    start: t.Optional(__nullable__(t.String())),
    prefix: t.Optional(__nullable__(t.String())),
    key: t.Optional(t.String()),
    refillInterval: t.Optional(__nullable__(t.Integer())),
    refillAmount: t.Optional(__nullable__(t.Integer())),
    lastRefillAt: t.Optional(__nullable__(t.Date())),
    enabled: t.Optional(__nullable__(t.Boolean())),
    rateLimitEnabled: t.Optional(__nullable__(t.Boolean())),
    rateLimitTimeWindow: t.Optional(__nullable__(t.Integer())),
    rateLimitMax: t.Optional(__nullable__(t.Integer())),
    requestCount: t.Optional(__nullable__(t.Integer())),
    remaining: t.Optional(__nullable__(t.Integer())),
    lastRequest: t.Optional(__nullable__(t.Date())),
    expiresAt: t.Optional(__nullable__(t.Date())),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
    permissions: t.Optional(__nullable__(t.String())),
    metadata: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ApikeyRelationsInputCreate = t.Object(
  {
    user: t.Object(
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
    createdAlerts: t.Optional(
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
    createdIncidents: t.Optional(
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
    updatedIncidents: t.Optional(
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

export const ApikeyRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
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
      createdAlerts: t.Partial(
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
      createdIncidents: t.Partial(
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
      updatedIncidents: t.Partial(
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

export const ApikeyWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          start: t.String(),
          prefix: t.String(),
          key: t.String(),
          userId: t.String(),
          refillInterval: t.Integer(),
          refillAmount: t.Integer(),
          lastRefillAt: t.Date(),
          enabled: t.Boolean(),
          rateLimitEnabled: t.Boolean(),
          rateLimitTimeWindow: t.Integer(),
          rateLimitMax: t.Integer(),
          requestCount: t.Integer(),
          remaining: t.Integer(),
          lastRequest: t.Date(),
          expiresAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          permissions: t.String(),
          metadata: t.String(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Apikey" },
  ),
);

export const ApikeyWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
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
              id: t.String(),
              name: t.String(),
              start: t.String(),
              prefix: t.String(),
              key: t.String(),
              userId: t.String(),
              refillInterval: t.Integer(),
              refillAmount: t.Integer(),
              lastRefillAt: t.Date(),
              enabled: t.Boolean(),
              rateLimitEnabled: t.Boolean(),
              rateLimitTimeWindow: t.Integer(),
              rateLimitMax: t.Integer(),
              requestCount: t.Integer(),
              remaining: t.Integer(),
              lastRequest: t.Date(),
              expiresAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              permissions: t.String(),
              metadata: t.String(),
              createdById: t.String(),
              updatedById: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Apikey" },
);

export const ApikeySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      start: t.Boolean(),
      prefix: t.Boolean(),
      key: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      refillInterval: t.Boolean(),
      refillAmount: t.Boolean(),
      lastRefillAt: t.Boolean(),
      enabled: t.Boolean(),
      rateLimitEnabled: t.Boolean(),
      rateLimitTimeWindow: t.Boolean(),
      rateLimitMax: t.Boolean(),
      requestCount: t.Boolean(),
      remaining: t.Boolean(),
      lastRequest: t.Boolean(),
      expiresAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      permissions: t.Boolean(),
      metadata: t.Boolean(),
      createdAlerts: t.Boolean(),
      createdIncidents: t.Boolean(),
      updatedIncidents: t.Boolean(),
      createdById: t.Boolean(),
      createdBy: t.Boolean(),
      updatedById: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ApikeyInclude = t.Partial(
  t.Object(
    {
      user: t.Boolean(),
      createdAlerts: t.Boolean(),
      createdIncidents: t.Boolean(),
      updatedIncidents: t.Boolean(),
      createdBy: t.Boolean(),
      updatedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ApikeyOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prefix: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refillInterval: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refillAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastRefillAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rateLimitEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rateLimitTimeWindow: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rateLimitMax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remaining: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastRequest: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      permissions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Apikey = t.Composite([ApikeyPlain, ApikeyRelations], {
  additionalProperties: false,
});

export const ApikeyInputCreate = t.Composite(
  [ApikeyPlainInputCreate, ApikeyRelationsInputCreate],
  { additionalProperties: false },
);

export const ApikeyInputUpdate = t.Composite(
  [ApikeyPlainInputUpdate, ApikeyRelationsInputUpdate],
  { additionalProperties: false },
);
